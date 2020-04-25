App = {
  web3Provider: null, contracts: {}, account: 0x0,
  init: function() {
  return App.initWeb3();
  },
  initWeb3: function() {
  if (typeof web3 !== 'undefined') {
  App.web3Provider = web3.currentProvider;
  web3 = new Web3(web3.currentProvider);
  } else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  web3 = new Web3(App.web3Provider);
  }
  App.displayAccountInfo();
  return App.initContract();
  },displayAccountInfo: function() {
  web3.eth.getCoinbase(function(err, account) {
  if (err === null) {
  App.account = account;
  $("#account").text(account);
  web3.eth.getBalance(account, function(err, balance) {
  if (err === null) {
  $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");
  }
  });
  }
  });
  },
  initContract: function() {
  $.getJSON('DSE.json', function(Artifact) {
  App.contracts.DSE = TruffleContract(Artifact);
  App.contracts.DSE.setProvider(App.web3Provider);
  App.listenToEvents();
  return App.setuser();
  });
  }, setuser: function () {
  if (App.loading) {
  return;
  }
  App.loading = true;
  App.displayAccountInfo();
  console.log("1");
  var DSEInstance;
  App.contracts.DSE.deployed().then(function(instance) {
  DSEInstance = instance;
  console.log("2");
  return DSEInstance.setUser(App.account);
  16
  }).then(function (result) {
  console.log("3");
  console.log(result);
  return App.stockList();
  }).catch(function(err) {
  console.log("4");
  console.log(err.message);
  App.loading = false;
  });
  },stockList: function () {
  App.contracts.DSE.deployed().then(function(instance) {
  return instance.getNoOfStockOfUser(App.account);
  }).then(function(object) {
  console.log(object)
  }).catch(function(err) {
  console.log(err.message);
  App.loading = false;
  })
  },addDemoStock: function() {
  App.contracts.DSE.deployed().then(function(instance) {
  return instance.addStock("AAPL",30,App.account,50);
  }).then(function(object) {
  console.log(object)
  }).catch(function(err) {
  console.log(err.message);
  App.loading = false;
  })
  },
  listenToEvents: function() {
  App.contracts.DSE.deployed().then(function(instance) {
  instance.addStockEvent({}, {
  fromBlock: 0,
  toBlock: 'latest' }).watch(function(error, event) {
  console.log(event);
  });
  });
  },
  bindEvents: function() {
  $(document).on('click', '.btn-adopt', App.handleAdopt);
  },
  $function() {
  $(window).load(function() {
  App.init();
  });
  },
}