"""
로깅 설정
"""
from loguru import logger
import sys
from pathlib import Path

# 로그 디렉토리 생성
log_dir = Path(__file__).parent.parent / "logs"
log_dir.mkdir(exist_ok=True)

# 기본 로거 제거
logger.remove()

# 콘솔 출력 (개발용)
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="DEBUG"
)

# 파일 로그 (프로덕션용)
logger.add(
    log_dir / "app_{time:YYYY-MM-DD}.log",
    rotation="00:00",  # 매일 자정에 새 파일
    retention="30 days",  # 30일간 보관
    compression="zip",  # 압축
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    level="INFO"
)

# 에러 전용 로그
logger.add(
    log_dir / "errors_{time:YYYY-MM-DD}.log",
    rotation="00:00",
    retention="90 days",
    compression="zip",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    level="ERROR"
)
