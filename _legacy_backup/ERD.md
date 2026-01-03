# 꿈을 그리는 농장 - ERD 데이터 설계도

이 문서는 현재 코드 분석과 기획을 바탕으로 **꿈을 그리는 농장** 애플리케이션의 데이터 구조를 정의한 ERD(Entity Relationship Diagram)입니다.

## 개체 관계 다이어그램 (ERD)

```mermaid
erDiagram
    %% 핵심 엔티티 관계
    USER ||--o{ FIELD : "소유 및 관리"
    FIELD ||--o| CROP : "재배 중"
    FIELD ||--o{ TASK : "작업 기록 보유"
    CROP ||--o{ TASK_TEMPLATE : "표준 재배 일정 제공"

    %% 사용자 엔티티 (Auth Service)
    USER {
        uuid id PK "사용자 고유 ID (Supabase Auth)"
        string email "이메일 주소"
        enum role "권한 (user | admin)"
        json preferences "사용자 설정 (JSON)"
        datetime created_at "가입 일시"
    }

    %% 농지 엔티티 (Farm Service / LocalStorage)
    FIELD {
        number id PK "식별자 (Timestamp/Auto-inc)"
        uuid user_id FK "소유자 ID"
        string name "농지 이름 (예: 뒷산 밭)"
        number area "면적 (평/m2)"
        string location "위치/주소"
        string facility_type "시설 유형 (노지/비닐하우스 등)"
        string crop_id FK "재배 작물 ID"
        datetime created_at "생성 일시"
    }

    %% 작물 엔티티 (농사로 API 데이터)
    CROP {
        string id PK "컨텐츠 번호 (농사로 API)"
        string name "작물명 (예: 고추)"
        string variety "품종명"
        string category "분류"
    }

    %% 작업 일정 엔티티 (기획 단계)
    TASK {
        string id PK "작업 ID"
        number field_id FK "대상 농지 ID"
        string content "작업 내용 (예: 물주기)"
        datetime date "예정/수행 날짜"
        string status "상태 (대기/완료)"
        string type "작업 유형 (비료/농약/수확 등)"
    }

    %% 외부 API 참조 데이터
    TASK_TEMPLATE {
        string id PK "템플릿 ID"
        string crop_id FK "대상 작물 ID"
        string stage "생육 단계"
        string work_content "추천 농작업"
    }

    %% 도매 시장 가격 (공공데이터 포털 - 도매시장 통합 웹서비스)
    MARKET_PRICE {
        string id PK "식별자"
        string crop_id FK "작물 ID"
        date date "기준 일자"
        string market "시장명 (가락시장 등)"
        string grade "등급 (특/상/보통)"
        number price "가격"
    }

    %% 병해충 예측 (NCPMS - 국가농작물병해충관리시스템)
    PEST_FORECAST {
        string id PK "예측 식별자"
        string crop_name "작물명"
        string pest_name "병해충명"
        date date "발령 일자"
        string alert_level "경보 단계 (주의/경보)"
        string symptom "피해 증상"
        string control_method "방제법"
    }

    %% [사용자 입력] 토양 검정 결과 (농업기술센터 시비처방서 기준)
    SOIL_TEST_RESULT {
        string id PK "검사 ID"
        number field_id FK "농지 ID"
        date test_date "검사 일자"
        number ph "산도(pH)"
        number om "유기물"
        number p2o5 "유효인산"
        number k "칼륨(K)"
        number ca "칼슘(Ca)"
        number mg "마그네슘(Mg)"
        number ec "전기전도도(EC)"
    }

    %% [사용자 입력] 수질 검사 결과 (시험결과서 기준)
    WATER_TEST_RESULT {
        string id PK "검사 ID"
        number field_id FK "농지 ID"
        date test_date "검사 일자"
        number ph "산도(pH)"
        number ec "전기전도도(EC)"
        number nh4_n "암모니아태질소"
        number no3_n "질산태질소"
        number fe "철(Fe)"
        number mn "망간(Mn)"
        json other_elements "기타 성분(K, Ca, Mg, S, Cl 등)"
    }
```

## 데이터 사전 (Data Dictionary)

### 1. User (사용자)
- **출처 (Source)**: `js/services/authService.js`
- **설명**: Supabase Auth를 통해 관리되는 사용자 계정 정보입니다.
- **주요 속성**: `id` (UUID), `role` (사용자/관리자 구분).

### 2. Field (농지)
- **출처 (Source)**: `js/components/fields.js`, `js/services/farmService.js`
- **설명**: 사용자가 등록하여 관리하는 개별 농지 정보입니다.
- **저장소**: 
    - (현재) 브라우저 `localStorage` (Key: `my_fields`)
    - **(향후)** NAS 구축 시 DB(MariaDB/PostgreSQL)로 이관 권장
- **주요 속성**: `name` (이름), `area` (면적), `location` (위치).

### 3. Crop (작물)
- **출처 (Source)**: `js/api/nonsaro.js` (외부 API)
- **설명**: 농사로(공공데이터) API에서 가져온 표준 작물 데이터 및 품종 정보입니다.
- **주요 속성**: `id` (식별자), `name` (작물명).

### 4. Task (농작업 일정 - 기획 중)
- **출처 (Source)**: `PROJECT_GOAL.md` (기획 문서)
- **참조 데이터**: 농사로 '농작업 일정 정보', '농사로 공통코드'.
- **설명**: 각 농지에서 수행해야 할 일별 농작업 스케줄입니다.

### 5. Market Price (도매 시세)
- **출처**: 공공데이터 포털 (농수산식품유통공사 도매시장 정산정보)
- **설명**: 작물의 일별 도매 시장 경매/정산 가격 정보입니다.
- **주요 속성**: `date`, `market`, `price`, `grade`.

### 6. Pest Forecast (병해충 예측)
- **출처**: NCPMS (국가농작물병해충관리시스템)
- **설명**: 기상 정보와 작물 생육 단계를 기반으로 한 병해충 발생 예측 정보입니다.
- **활용**: '농심(Farmers Mind)' 알림 서비스의 핵심 데이터.

### 7. Soil/Water Test Results (토양/수질 검사 결과 - 사용자 입력)
- **출처**: 사용자가 직접 입력 (시비처방서 및 시험결과서 기반)
- **설명**: 개별 농지의 토양 및 농업용수 분석 결과 이력입니다.
- **주요 속성**:
    - **토양**: `test_date`, `ph`, `om`(유기물), `ec`
    - **수질**: `test_date`, `ph`, `ec`, `no3_n`, `nh4_n`
