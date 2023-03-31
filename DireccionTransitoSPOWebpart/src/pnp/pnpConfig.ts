import { WebPartContext } from "@microsoft/sp-webpart-base";

// import pnp and pnp logging system
// import { Caching } from "@pnp/queryable";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/files"
import "@pnp/sp/folders"
import "@pnp/sp/batching";

let _sp: SPFI = null;

export const getSP = (context?: WebPartContext): SPFI => {

	if (_sp === null && context !== null) {

		//You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
		// The LogLevel set's at what level a message will be written to the console
		_sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning))//.using(Caching({ store: "local" }));

	}

	return _sp;
	
};

// export function GetGraph (context?: WebPartContext): GraphFI {

// 	return graphfi().using(graphSPFx(context));

// }