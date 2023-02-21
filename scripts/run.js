const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("verifyportal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();
    console.log("Contract addy:", waveContract.address);
  
    let waveCount;
    waveCount = await waveContract.getTotalVerifications();
    console.log(waveCount.toNumber());
  
    /**
     * Let's send a few waves!
     */
    let waveTxn = await waveContract.verify("A message!");
    await waveTxn.wait(); // Wait for the transaction to be mined
  
    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(randomPerson).verify("Another message!");
    await waveTxn.wait(); // Wait for the transaction to be mined
  
    let allWaves = await waveContract.getAllVerifications();
    console.log(allWaves);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();