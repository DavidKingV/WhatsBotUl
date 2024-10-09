import { createFlow } from '@builderbot/bot';
import { WelcomeFlow } from './welcome';
import { AgentFlow } from './agent';
import { blackListFlow } from './blacklist';
import { idleFlow } from '../src/utils/idle'
import { ConsultaFlow } from './consulta'

export const flow = createFlow([WelcomeFlow, AgentFlow, idleFlow, ConsultaFlow, blackListFlow])