import { getMod } from '../lib/modUtils';

async function verifyMod() {
  try {
    const mod = await getMod('native-mod-loader');
    console.log('Retrieved mod:');
    console.log(JSON.stringify(mod, null, 2));
  } catch (error) {
    console.error('Failed to retrieve mod:', error);
  }
}

verifyMod();
