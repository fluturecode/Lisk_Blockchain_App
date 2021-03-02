// 1.Import lisk sdk to create the blockchain application
const {
	Application,
	configDevnet,
	genesisBlockDevnet,
	HTTPAPIPlugin,
	utils,
} = require('lisk-sdk');

// 2.Import SRS module
const { SRSModule } = require('./srs_module');
const { SRSAPIPlugin } = require('./srs_api_plugin/');

// 3.Update the genesis block accounts to include SRS module attributes
genesisBlockDevnet.header.timestamp = 1605699440;
genesisBlockDevnet.header.asset.accounts = genesisBlockDevnet.header.asset.accounts.map(
	(account) =>
		utils.objects.mergeDeep({}, account, {
			srs: {
				config: {
					friends: [],
					recoveryThreshold: 0,
					delayPeriod: 0,
				},
				status: {
					active: false,
					vouchList: [],
					created: 0,
					deposit: BigInt(0),
					rescuer: Buffer.from(''),
				},
			},
		}),
);

// 4.Update application config to include unique label
// and communityIdentifier to mitigate transaction replay
const appConfig = utils.objects.mergeDeep({}, configDevnet, {
	label: 'srs-app',
	genesisConfig: { communityIdentifier: 'SRS' }, //In order to have a unique networkIdentifier
	logger: {
		consoleLogLevel: 'info',
	},
    rpc: {
        enable: true,
        mode: 'ipc',
        port: 8080,
    },
});

// 5.Initialize the application with genesis block and application config
const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

// 6.Register custom SRS Module and Plugins
app.registerModule(SRSModule);
app.registerPlugin(HTTPAPIPlugin);
app.registerPlugin(SRSAPIPlugin);

// 7.Run the application
app
	.run()
	.then(() => console.info('SRS Blockchain running....'))
	.catch(console.error);
