import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const phrases = [
    "Солнце светит ярко",
    "Дождь идёт за окном",
    "Птицы поют песни",
    "Ветер дует сильно",
    "Море волнуется синее",
    "Звёзды сияют ночью",
    "Цветы пахнут сладко",
    "Река течёт быстро",
  ];

  const generateNewPhrase = () => {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(randomPhrase);
    setUserInput("");
    setAttempts(0);

    // Симуляция синтеза речи
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(randomPhrase);
      utterance.lang = "ru-RU";
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const playAudio = () => {
    if (currentPhrase) {
      setIsPlaying(true);
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(currentPhrase);
        utterance.lang = "ru-RU";
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
      }
    }
  };

  const verifyInput = () => {
    if (userInput.toLowerCase().trim() === currentPhrase.toLowerCase().trim()) {
      setIsVerified(true);
    } else {
      setAttempts((prev) => prev + 1);
      if (attempts >= 2) {
        generateNewPhrase();
      }
    }
  };

  const resetCaptcha = () => {
    setIsVerified(false);
    generateNewPhrase();
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <Card className="w-full max-w-md mx-4 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="Check" className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Верификация пройдена!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Добро пожаловать на сайт
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={resetCaptcha} variant="outline" className="mt-4">
              Пройти капчу заново
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="Shield" className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Аудио Капча
          </CardTitle>
          <CardDescription className="text-gray-600">
            Прослушайте фразу и введите её текстом
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <Button
                onClick={generateNewPhrase}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Icon name="RotateCcw" className="w-4 h-4 mr-2" />
                Новая фраза
              </Button>
              <Button
                onClick={playAudio}
                size="lg"
                variant="outline"
                disabled={!currentPhrase || isPlaying}
              >
                <Icon
                  name={isPlaying ? "Pause" : "Play"}
                  className="w-4 h-4 mr-2"
                />
                {isPlaying ? "Играет..." : "Воспроизвести"}
              </Button>
            </div>

            {currentPhrase && (
              <div className="w-full space-y-3">
                <Input
                  type="text"
                  placeholder="Введите услышанную фразу..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="text-center"
                  onKeyPress={(e) => e.key === "Enter" && verifyInput()}
                />
                <Button
                  onClick={verifyInput}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!userInput.trim()}
                >
                  Проверить
                </Button>
                {attempts > 0 && (
                  <p className="text-sm text-red-600 text-center">
                    Неверно. Попыток: {attempts}/3
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
