import { playerID } from "@/config/litterals/ui";

export function getCurrentTime() {
    const player = document.getElementById(playerID)! as HTMLMediaElement; 
    return player ? player.currentTime : 0;  
}