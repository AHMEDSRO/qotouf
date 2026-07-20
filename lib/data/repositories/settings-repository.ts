import type { PlatformSettings, PlatformSettingsPatch } from '@/lib/types/settings';
import type { RequestContext } from '@/lib/auth/auth-provider';

export interface SettingsRepository {
  get(): Promise<PlatformSettings>;
  update(ctx: RequestContext, patch: PlatformSettingsPatch): Promise<PlatformSettings>;
}
