import { createFlow } from '@builderbot/bot';
import { WelcomeFlow } from './welcome';
import { AgentFlow } from './agent';
import { blackListFlow } from './blacklist';

export const flow = createFlow([WelcomeFlow, AgentFlow, blackListFlow])