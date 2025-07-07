import { ErrorMessage } from '@/common/network/messages/ErrorMessage';
import { LoadPluginOptionsMessage } from '@/common/network/messages/LoadPluginOptionsMessage';
import { PingMessage } from '@/common/network/messages/PingMessage';
import { HelloWorldMessage } from '@/common/network/messages/HelloWorldMessage';
import { ExtractACFMessage } from '@/common/network/messages/ExtractACFMessage';
import * as Networker from 'monorepo-networker';

export namespace NetworkMessages {
  export const registry = new Networker.MessageTypeRegistry();
  export const LOG_ERROR = registry.register(new ErrorMessage('error'));
  export const LOAD_PLUGIN_OPTIONS = registry.register(new LoadPluginOptionsMessage('load-plugin-options'));
  export const PING = registry.register(new PingMessage('ping'));
  export const HELLO_WORLD = registry.register(new HelloWorldMessage('hello-world'));
  export const EXTRACT_ACF = registry.register(new ExtractACFMessage('extract-acf'));
}
