const { ethers } = require("hardhat");

const { expect } = require("chai");
describe("Bidding", function () {
  let admin;
  let bidding;
  let token;

  before(async function () {
    [admin] = await ethers.getSigners();
    const Bidding = await ethers.getContractFactory("Bidding");
    bidding = await Bidding.deploy();
    await bidding.waitForDeployment();

    const GoofyGoober = await ethers.getContractFactory("GoofyGoober");
    token = await GoofyGoober.deploy();
    await token.waitForDeployment();
    await bidding.setToken(await token.getAddress());
  });

  it("Should create an auction", async function () {

    const [, bidder1, bidder2] = await ethers.getSigners();

    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 30 * 24 * 60 * 60;
    await bidding.createAuction(0, startTime, endTime);

    // FIRST BID
    await token.connect(admin).transfer(await bidder1.getAddress(), ethers.parseUnits("10", 6));
    await token.connect(bidder1).approve(await bidding.getAddress(), ethers.parseUnits("1", 6));
    await bidding.connect(bidder1).placeBid(0, ethers.parseUnits("1", 6));

    const auction = await bidding.getLatestAuction();

    expect(auction.highestBid).to.equal(ethers.parseUnits("1", 6));
    expect(auction.highestBidder).to.equal(await bidder1.getAddress());
    expect(await token.balanceOf(await bidder1.getAddress())).to.equal(ethers.parseUnits("9", 6));



    // SECOND BID
    await token.connect(admin).transfer(await bidder2.getAddress(), ethers.parseUnits("10", 6));
    await token.connect(bidder2).approve(await bidding.getAddress(), ethers.parseUnits("2", 6));
    await bidding.connect(bidder2).placeBid(0, ethers.parseUnits("2", 6));

    const auction2 = await bidding.getLatestAuction();

    expect(auction2.highestBid).to.equal(ethers.parseUnits("2", 6));
    expect(auction2.highestBidder).to.equal(await bidder2.getAddress());
    expect(await token.balanceOf(await bidder2.getAddress())).to.equal(ethers.parseUnits("8", 6));

    // BALANCES OF BIDDERS AND AUCTION CONTRACT
    expect(await token.balanceOf(await bidder1.getAddress())).to.equal(ethers.parseUnits("10", 6));
    expect(await token.balanceOf(await bidding.getAddress())).to.equal(ethers.parseUnits("2", 6));
  });
});
