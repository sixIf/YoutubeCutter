import { container } from 'tsyringe'
import { YoutubeClient } from "@/api/youtubeClient";
import { YoutubeService } from "@/services/youtubeService";
import { ApiKeyService } from "@/services/apiKeyService";
import { ApiKeyStore } from "@/store/apiKeyStore"

container.register("IApiKeyStore", { useClass: ApiKeyStore });
container.register("IApiKeyService", { useClass: ApiKeyService });
container.register("IYoutubeClient", { useClass: YoutubeClient });
container.register("IYoutubeService", { useClass: YoutubeService });

export { container as ApplicationContainer };