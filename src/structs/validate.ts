export function checkCommandModule(cmdName: any, cmdModule: any) {
	/* eslint-disable */
	if(!cmdModule.hasOwnProperty('run')) {throw new Error(`${cmdName} command module does not have property 'run'.`);}
	if(!cmdModule.hasOwnProperty('description')) {throw new Error(`${cmdName} command module does not have property 'description'.`);}
	if(!cmdModule.hasOwnProperty('aliases')) {throw new Error(`${cmdName} command module does not have property 'aliases'.`);}
	if(!cmdModule.hasOwnProperty('type')) {throw new Error(`${cmdName} command module does not have property 'type'.`);}
	if(!cmdModule.hasOwnProperty('usage')) {throw new Error(`${cmdName} command module does not have property 'usage'.`);}
    /* eslint-enable */
	return true;
};

export function checkProperties(cmdName: any, cmdModule: any) {
	const typeTypes = ['util', 'mod', 'fun', 'dev'];
	if(typeof cmdModule.run !== 'function') {throw new Error(`${cmdName} command: 'run' is not a function.`);}
	if(typeof cmdModule.description !== 'string') {throw new Error(`${cmdName} command: 'description' is not a string.`);}
	if(!Array.isArray(cmdModule.aliases)) {throw new Error(`${cmdName} command: 'aliases' is not an Array.`);}
	if(typeof cmdModule.type !== 'string') {throw new Error(`${cmdName} command: 'type' is not a string`);}
	if(!typeTypes.includes(cmdModule.type)) {throw new Error(`${cmdName} command:  'type' should be ${typeTypes} which doesn't include '${cmdModule.type}'`);}
	if(typeof cmdModule.usage !== 'string') {throw new Error(`${cmdName} command: 'usage' is not a string.`);}
	return true;
};
