// Tests for src/registry.js — the ORIGINAL protocols server.
//
// READ THIS BEFORE TRUSTING A GREEN RUN. src/ is DORMANT. Claude Desktop wires
// the protocols server to ~/Code/mcp-protocols-lean/index.js, which reads this
// repo's protocols/ markdown directory via PROTOCOLS_DIR. harness/contract_check.mjs
// lists 'Code/mcp-protocols/src' in DORMANT_SOURCES for exactly this reason.
// So: green here says the legacy registry still loads. It says NOTHING about the
// live system — mcp-protocols-lean/test is where that is covered.
//
// Rewritten 2026-08-20. The previous version asserted a five-protocol seed
// library (error-recovery, user-communication, task-approach,
// information-integration, progress-communication) that stopped being the whole
// registry long ago; it had been red for an unknown length of time, testing
// dormant code against a world that no longer existed. These assertions pin what
// is actually true today.
//
// Run with `npm test` (jest). `node --test` cannot run this file — it is
// jest-style and dies with "describe is not defined".

const {
  getAllProtocols, getProtocol, searchProtocols, getProtocolsForSituation,
} = require('../src/registry');

describe('MCP Protocols Server (dormant legacy registry)', () => {
  describe('Registry Functions', () => {
    test('loads the whole registry, not just the original seed five', () => {
      const protocols = getAllProtocols();
      const ids = Object.keys(protocols);
      // Pinned as a floor, not an exact count, so adding a protocol is not a failure.
      expect(ids.length).toBeGreaterThanOrEqual(20);
      // The original five must still be present...
      for (const id of ['error-recovery', 'user-communication', 'task-approach',
        'information-integration', 'progress-communication']) {
        expect(protocols[id]).toBeDefined();
      }
      // ...alongside the tier-0 meta protocols that were added after them.
      expect(protocols['protocol-selection']).toBeDefined();
      expect(protocols['prompt-processing']).toBeDefined();
    });

    test('should retrieve specific protocol by ID', () => {
      const protocol = getProtocol('error-recovery');
      expect(protocol).toBeDefined();
      expect(protocol.name).toBe('Error Recovery Protocol');
      expect(protocol.version).toBe('1.1.0');
      expect(protocol.tier).toBe(2);
    });

    test('should return undefined for non-existent protocol', () => {
      const protocol = getProtocol('non-existent');
      expect(protocol).toBeUndefined();
    });

    test('search finds the matching protocol somewhere in its results', () => {
      const results = searchProtocols('error');
      expect(results.length).toBeGreaterThan(0);
      // searchProtocols is an unranked filter over name/purpose/triggers/content,
      // so it returns registry order. The old test asserted results[0] was
      // error-recovery; protocol-selection legitimately mentions "error" too and
      // is declared first. Assert membership, which is what the function promises.
      expect(results.map(p => p.id)).toContain('error-recovery');
    });

    test('all protocols should have required fields', () => {
      const protocols = Object.values(getAllProtocols());
      protocols.forEach(protocol => {
        expect(protocol.id).toBeDefined();
        expect(protocol.name).toBeDefined();
        expect(protocol.purpose).toBeDefined();
        expect(protocol.tier).toBeDefined();
      });
    });

    test('all protocols should have trigger conditions', () => {
      const protocols = Object.values(getAllProtocols());
      protocols.forEach(protocol => {
        expect(Array.isArray(protocol.triggers)).toBe(true);
        expect(protocol.triggers.length).toBeGreaterThan(0);
      });
    });
  });

  describe('known limitation (dormant code — not being fixed here)', () => {
    // getProtocolsForSituation compares the WHOLE situation string against the
    // WHOLE trigger sentence with two-way includes(). Triggers are full sentences
    // ("Tool returns error, failure, or unexpected response"), so nothing a person
    // would actually type ever matches. It only fires on a verbatim trigger:
    //
    //   getProtocolsForSituation('error occurred')                    -> []
    //   getProtocolsForSituation('Tool returns error, failure, ...')  -> ['error-recovery']
    //
    // This is a real defect, and it is a large part of why the lean server exists:
    // mcp-protocols-lean matches on tokens with stopword filtering and scoring.
    // Left red-as-todo rather than repaired, because repairing dormant code would
    // create a second matcher to keep in sync with the live one.
    test.failing('a plain-language situation matches its protocol', () => {
      const results = getProtocolsForSituation('error occurred');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('error-recovery');
    });

    test('the verbatim-trigger path does still work', () => {
      const results = getProtocolsForSituation('Tool returns error, failure, or unexpected response');
      expect(results.map(p => p.id)).toContain('error-recovery');
    });
  });
});
