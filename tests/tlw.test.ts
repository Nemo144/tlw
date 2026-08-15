import { Cl } from "@stacks/transactions";
import { describe, expect, it, test } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

describe("Testing lock", () => {
  test("Allows the contract owner to lock an amount", () => {
    const deployer = accounts.get("deployer")!;
    const beneficiary = accounts.get("wallet_1")!;
    const amount = 10;

    const lockResponse = simnet.callPublicFn(
      "tlw",
      "lock",
      [Cl.principal(beneficiary), Cl.uint(10), Cl.uint(amount)],
      deployer,
    );

    // The lock should be successful.
    expect(lockResponse.result).toBeOk(Cl.bool(true));

    // There should be a STX transfer of the amount specified.
    expect(lockResponse.events).toHaveLength(1);
    expect(lockResponse.events[0].event).toBe("stx_transfer_event");

    expect(lockResponse.events[0].data).toMatchObject({
      amount: amount.toString(),
      sender: deployer,
      recipient: `${deployer}.tlw`,
    });
  });

  test("Does not allow anyone else to lock an amount", () => {
    const accountA = accounts.get("wallet_1")!;
    const beneficiary = accounts.get("wallet_2")!;

    const lockResponse = simnet.callPublicFn(
      "tlw",
      "lock",
      [Cl.principal(beneficiary), Cl.uint(10), Cl.uint(10)],
      accountA,
    );

    // Should return err-owner-only (err u100).
    expect(lockResponse.result).toBeErr(Cl.uint(100));
  });

  test("Cannot lock more than once", () => {
    const deployer = accounts.get("deployer")!;
    const beneficiary = accounts.get("wallet_1")!;
    const unlockAt = 10;
    const amount = 10;

    const lockResponse1 = simnet.callPublicFn(
      "tlw",
      "lock",
      [Cl.principal(beneficiary), Cl.uint(unlockAt), Cl.uint(amount)],
      deployer,
    );
    const lockResponse2 = simnet.callPublicFn(
      "tlw",
      "lock",
      [Cl.principal(beneficiary), Cl.uint(unlockAt), Cl.uint(amount)],
      deployer,
    );

    // The first lock worked and STX were transferred.
    expect(lockResponse1.result).toBeOk(Cl.bool(true));
    expect(lockResponse1.events).toHaveLength(1);
    expect(lockResponse1.events[0].event).toBe("stx_transfer_event");

    expect(lockResponse1.events[0].data).toMatchObject({
      amount: amount.toString(),
      sender: deployer,
      recipient: `${deployer}.tlw`,
    });

    // The second lock fails with err-already-locked (err u101).
    expect(lockResponse2.result).toBeErr(Cl.uint(101));

    // Assert there are no transfer events.
    expect(lockResponse2.events).toHaveLength(0);
  });

  test("Unlock height cannot be in the past", () => {
    const deployer = accounts.get("deployer")!;
    const beneficiary = accounts.get("wallet_1")!;
    const amount = 10;
    const targetBlockHeight = 10;

    // Advance the chain until the unlock height plus one.
    simnet.mineEmptyBlocks(targetBlockHeight + 1);

    const lockResponse = simnet.callPublicFn(
      "tlw",
      "lock",
      [Cl.principal(beneficiary), Cl.uint(targetBlockHeight), Cl.uint(amount)],
      deployer,
    );

    // The lock fails with err-unlock-in-past (err u102).
    expect(lockResponse.result).toBeErr(Cl.uint(102));

    // Assert there are no transfer events.
    expect(lockResponse.events).toHaveLength(0);
  });
});
