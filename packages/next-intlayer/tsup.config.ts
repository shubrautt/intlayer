import { packageBuildOptions } from '@utils/ts-config/tsup';
import { type Options, defineConfig } from 'tsup';

const option: Options[] = (packageBuildOptions as Options[]).map((option) => ({
  ...option,
  outDir: 'dist',
}));

export default defineConfig(option);
