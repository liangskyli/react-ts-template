import { net, protocol } from 'electron';
import path from 'node:path';

const createProtocol = (scheme: string) => {
  /*protocol.registerFileProtocol(scheme, (request, respond) => {
    const pathUrl = request.url.substring(scheme.length + 3);
    // only path
    const filePath = path.join(__dirname, pathUrl).split('#')[0];
    respond({ path: filePath });
  });*/
  // need electron >= 25.0.0
  protocol.handle(scheme, (request) => {
    const pathUrl = request.url.substring(scheme.length + 3);
    const filePath = path.join(__dirname, pathUrl);
    return net.fetch(`file://${filePath}`);
  });
};
export default createProtocol;
