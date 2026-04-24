import Api from './Api';
import Services from './Services';

class BlsCore {
  api: Api;
  services: Services;

  constructor() {
    this.api = new Api();
    this.services = new Services();
  }
}

const blsCore = new BlsCore();
export default blsCore;
