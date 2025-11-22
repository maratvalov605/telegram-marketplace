import re
from typing import List, Dict, Optional
import logging

class ContentModerator:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        # Загружаем словари из файлов или БД
        self.forbidden_words = self._load_forbidden_words()
        self.contact_patterns = [
            r'\+?[78][-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}',  # Телефоны
            r'@[A-Za-z0-9_]{5,}',  # Telegram username
            r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}',  # Email
            r'(?:vk\.com|instagram\.com|t\.me)/[A-Za-z0-9_]+'  # Соцсети
        ]

    def _load_forbidden_words(self) -> List[str]:
        # В будущем можно загружать из БД или файла конфигурации
        return ["запрещенное_слово1", "мошенник", "обман"]

    def moderate_text(self, text: str) -> Dict:
        """Основной метод модерации текста"""
        result = {
            "is_approved": True,
            "reasons": [],
            "score": 0
        }

        # Проверка на запрещенные слова
        forbidden_matches = self._check_forbidden_words(text)
        if forbidden_matches:
            result["is_approved"] = False
            result["reasons"].append(f"Обнаружены запрещенные слова: {', '.join(forbidden_matches)}")
            result["score"] += len(forbidden_matches) * 10

        # Детектирование контактов
        contact_matches = self._check_contact_leaks(text)
        if contact_matches:
            result["is_approved"] = False
            result["reasons"].append(f"Обнаружены контакты: {', '.join(contact_matches)}")
            result["score"] += len(contact_matches) * 20

        # Обход фильтров (базовый)
        evasion_attempt = self._detect_evasion(text)
        if evasion_attempt:
            result["is_approved"] = False
            result["reasons"].append("Обнаружена попытка обхода фильтров")
            result["score"] += 30

        return result

    def _check_forbidden_words(self, text: str) -> List[str]:
        found = []
        text_lower = text.lower()
        for word in self.forbidden_words:
            if word in text_lower:
                found.append(word)
        return found

    def _check_contact_leaks(self, text: str) -> List[str]:
        found = []
        for pattern in self.contact_patterns:
            matches = re.findall(pattern, text)
            found.extend(matches)
        return found

    def _detect_evasion(self, text: str) -> bool:
        # Обнаружение замены символов (e -> е, o -> о)
        evasion_patterns = [
            r'[a-zа-я]'  # Смешение алфавитов
        ]
        for pattern in evasion_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False