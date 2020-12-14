import { container } from 'tsyringe'
import { YoutubeClient } from "@/api/youtubeClient";
import { YoutubeService } from "@/services/youtubeService";
import { ApiKeyService } from "@/services/apiKeyService";
import { ApiKeyStore } from "@/store/apiKeyStore"
import { DownloadFolderService } from "@/services/downloadFolderService";
import { LoggerService } from "@/services/loggerService";
import { LocaleService } from "@/services/localeService";
import { DownloadFolderStore } from "@/store/downloadFolderStore"

container.register("IDownloadFolderStore", { useClass: DownloadFolderStore });
container.register("IDownloadFolderService", { useClass: DownloadFolderService });
container.register("IApiKeyStore", { useClass: ApiKeyStore });
container.register("IApiKeyService", { useClass: ApiKeyService });
container.register("IYoutubeClient", { useClass: YoutubeClient });
container.register("IYoutubeService", { useClass: YoutubeService });
container.register("ILoggerService", { useClass: LoggerService });
container.register("ILocaleService", { useClass: LocaleService });

export { container as ApplicationContainer };