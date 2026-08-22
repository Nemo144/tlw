import { describe, expect, it, test } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

test("Disburses tokens once it can claim the tl wallet balance", () => {
  const deployer = accounts.get("deployer")!;
  const beneficiary = `${deployer}.sc`;

  // Wallets to receive the share. Hardcoded in contract.
  const wallet1 = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  const wallet2 = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";
  const wallet3 = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG";
  const wallet4 = "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC";

  const unlockHeight = 10;
  const amount = 1000; // be sure to pick a test amount that is divisible by 4 for this test.
  const share = Math.floor(amount / 4);

  simnet.callPublicFn(
    "tlw",
    "lock",
    [Cl.principal(beneficiary), Cl.uint(unlockHeight), Cl.uint(amount)],
    deployer,
  );
  simnet.mineEmptyBlocks(unlockHeight);

  const claimResponse = simnet.callPublicFn("sc", "claim", [], deployer);

  // The claim should be successful.
  expect(claimResponse.result).toBeOk(Cl.bool(true));

  // The claim should have 5 events, all of type 'stx_transfer_event'.
  // 1 for the smart-claimant, and 4 for the wallets.
  expect(claimResponse.events).toHaveLength(5);
  expect(
    claimResponse.events.every((event) => event.event === "stx_transfer_event"),
  ).toBe(true);

  const eventsData = claimResponse.events.map((x) => x.data);

  // The smart-claimant should have received the amount.
  expect(eventsData).toContainEqual({
    amount: amount.toString(),
    memo: "",
    sender: `${deployer}.tlw`,
    recipient: `${deployer}.sc`,
  });

  // All wallets should have received their share.
  [wallet1, wallet2, wallet3, wallet4].forEach((wallet) => {
    expect(eventsData).toContainEqual({
      amount: share.toString(),
      memo: "",
      sender: `${deployer}.sc`,
      recipient: wallet,
    });
  });
});
