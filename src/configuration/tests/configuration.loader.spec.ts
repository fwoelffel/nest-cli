import { ConfigurationLoader } from '../configuration.loader';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as path from 'path';
import { FileSystemUtils } from '../../utils/file-system.utils';

describe('ConfigurationLoader', () => {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('#load()', () => {
    let readFileStub: sinon.SinonStub;
    let setStub: sinon.SinonStub;
    beforeEach(() => {
      readFileStub = sandbox.stub(FileSystemUtils, 'readFile').callsFake(() => Promise.resolve('{"key": "value"}'));
      setStub = sandbox.stub(Map.prototype, 'set');
    });

    it('should read the property file', () => {
      return ConfigurationLoader.load()
        .then(() => {
          sinon.assert.calledWith(readFileStub, path.join(process.cwd(), 'nestconfig.json'));
        });
    });

    it('should parse the property file to fill the property Map', () => {
      return ConfigurationLoader.load()
        .then(() => {
          sinon.assert.calledWith(setStub, 'key', 'value');
        });
    });
  });

  describe('#getProperty()', () => {
    let getStub: sinon.SinonStub;
    beforeEach(() => getStub = sandbox.stub(Map.prototype, 'get'));

    it('should return the asked property', () => {
      getStub.callsFake(() => 'ts');
      expect(ConfigurationLoader.getProperty('language')).to.be.equal('ts');
    });

    it('should throws an exception to indicate a missing property', () => {
      getStub.callsFake(() => undefined);
      expect(() =>
        ConfigurationLoader.getProperty('language')
      ).to.throw('Missing property "language"');
    });
  });
});
