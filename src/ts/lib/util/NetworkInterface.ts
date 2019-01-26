import TokenHandler from './TokenHandler'
import { GraphQLClient } from 'graphql-request'
import * as Common from './Common'
import SRQ from './StaggeredRequestQueue'
import request from 'request-promise'

const API_URL = process.env.ApiUrl || 'https://api.smash.gg/gql/alpha'
const RATE_LIMIT_MS_TIME = process.env.RateLimitMsTime || 1000

import Variables = INetworkInterface.Variables

export default class NetworkInterface{

	static client: GraphQLClient
	static initialized: boolean = false

	static init(){
		NetworkInterface.client = new GraphQLClient(API_URL, NetworkInterface.getHeaders())
		NetworkInterface.initialized = true
	}

	static getHeaders(){
		let token = TokenHandler.getToken()
		if(!token) throw new Error('Cannot initialize without a token for smash.gg')
		
		return { 
			headers:{
				'X-Source': 'smashgg.js',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		}
	}

	
	/**
	 * query
	 * 
	 * takes a graphql query string and corresponding variable object
	 * and puts the execution of this query into a queue which is staggered
	 * by the standard rate limit imposed by smashgg.
	 * 
	 * Useful for when many queries need to be run consecutively
	 * 
	 * @param  {string} query
	 * @param  {object} variables 
	 * @returns {promise} resolving the results of the query after being staggered in the request queue
	 */
	static query(query: string, variables: Variables) : Promise<any>{
		return new Promise(function(resolve, reject){ 
			SRQ.getInstance().add(() => {
				return NetworkInterface.client.request(query, variables)
					.then(resolve)
					.catch(reject)
			})
		})
	}

	static async singleQuery(query: string, variables: Variables) : Promise<any>{
		await Common.sleep(+RATE_LIMIT_MS_TIME)
		return await NetworkInterface.client.request(query, variables)
	}

	static async query3(query: string, variables: Variables) : Promise<any>{
		let options = {
			method: 'POST',
			headers: NetworkInterface.getHeaders().headers,
			uri: API_URL,
			body: {
				query: query,
				variables: variables
			},
			json: true
		}
		await Common.sleep(+RATE_LIMIT_MS_TIME)
		return await request(options)
	}
}

namespace INetworkInterface{
	export interface NetworkInterface{

	}

	export interface Variables{

	}
}

module.exports = NetworkInterface