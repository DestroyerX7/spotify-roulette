"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayerSelectionButton;
const react_1 = __importDefault(require("react"));
const button_1 = require("./ui/button");
function PlayerSelectionButton({ playerId, username, canSelect, isSelected, showCorrectAnswer, correctPlayerId, selectPlayer, }) {
    const trySelect = () => {
        if (!canSelect) {
            return;
        }
        selectPlayer(playerId);
    };
    const getColor = () => {
        if (showCorrectAnswer) {
            if (correctPlayerId === playerId) {
                return "bg-green-500";
            }
            else {
                return "bg-red-500";
            }
        }
        else if (isSelected) {
            return "border-2 border-black";
        }
        else {
            return "";
        }
    };
    const ponierBehaviour = canSelect ? "cursor-pointer" : "pointer-events-none";
    const color = getColor();
    return (<button_1.Button className={`${ponierBehaviour} ${color}`} onClick={() => trySelect()} variant="secondary">
      {username}
    </button_1.Button>);
}
