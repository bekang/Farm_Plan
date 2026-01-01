"""
유틸리티 함수 모음
"""


def format_currency(amount: float) -> str:
    """
    금액을 한국 원화 형식으로 포맷팅
    
    Args:
        amount: 금액
        
    Returns:
        포맷팅된 문자열 (예: "1,234,567원")
    """
    return f"{int(amount):,}원"


def format_area(area_m2: float, unit: str = "m2") -> str:
    """
    면적을 다양한 단위로 포맷팅
    
    Args:
        area_m2: 제곱미터 면적
        unit: 출력 단위 ("m2", "pyeong", "ha")
        
    Returns:
        포맷팅된 문자열
    """
    if unit == "pyeong":
        pyeong = area_m2 / 3.3
        return f"{pyeong:,.1f}평"
    elif unit == "ha":
        ha = area_m2 / 10000
        return f"{ha:,.2f}ha"
    else:
        return f"{area_m2:,.0f}㎡"


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """
    안전한 나눗셈 (0으로 나누기 방지)
    
    Args:
        numerator: 분자
        denominator: 분모
        default: 분모가 0일 때 반환값
        
    Returns:
        계산 결과 또는 기본값
    """
    return numerator / denominator if denominator != 0 else default
