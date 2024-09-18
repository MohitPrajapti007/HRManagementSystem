import { Injectable } from '@angular/core';
import { IS_DOMAIN_IP_ADDRESS } from './global-constants';
declare var window: any;

@Injectable()
export class AppConfigService {

 private appConfig: any;
  constructor() { }

  loadConfig() {
    
      var promise = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
	      let root = '';
          if(IS_DOMAIN_IP_ADDRESS.test(location.hostname)) {
            root = location.pathname.substring(0, location.pathname.indexOf('/', 2));            
          }    
          let config = {
                        environment: 'prod',
                        context : `${root}`,
                        apiContextUrl: `${root}/api`
                       }
          if(window.location.hostname == 'localhost') {            
            config = {
                      environment: 'local',
                      context : 'http://localhost:8080/basemvc',
                      apiContextUrl: 'http://localhost:8080/basemvc/api'
                    }
          }
          window.config = config;
          resolve();
        }, 100);
      });
      return promise;
  }
  getConfig() {
    return this.appConfig;
  }

}
