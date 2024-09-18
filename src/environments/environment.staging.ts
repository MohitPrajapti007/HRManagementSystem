import { DynamicEnvironment } from "./dynamic-environment";

class Environment extends DynamicEnvironment {
  production: boolean = false;
  staging: boolean = false;
  constructor() {
    super();
    production: false;
    staging: true;
  }
}
export const environment = new Environment();