import * as Networker from 'monorepo-networker';
import { NetworkSide } from '@/common/network/sides';

export class ExtractACFMessage extends Networker.MessageType<{}> {
  public receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  public handle(payload: {}, from: Networker.Side): void {
    console.log('ExtractACFMessage');
  }
} 