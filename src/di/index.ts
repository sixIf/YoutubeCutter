import { container } from 'tsyringe'
import { YoutubeClient } from "@/api/youtubeClient";
import { YoutubeService } from "@/services/youtubeService";
import { DownloadFolderService } from "@/services/downloadFolderService";
import { LoggerService } from "@/services/loggerService";
import { DownloadFolderStore } from "@/store/downloadFolderStore"

container.register("IDownloadFolderStore", { useClass: DownloadFolderStore });
container.register("IDownloadFolderService", { useClass: DownloadFolderService });
container.register("IYoutubeClient", { useClass: YoutubeClient });
container.register("IYoutubeService", { useClass: YoutubeService });
container.register("ILoggerService", { useClass: LoggerService });

export { container as ApplicationContainer };