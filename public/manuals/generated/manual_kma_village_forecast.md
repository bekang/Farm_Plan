# KMA Village Forecast API Manual
**Service**: 단기 예보 (Village Forecast)
**Source**: Korea Meteorological Administration (KMA)
**Verification**: Verified via Public Data Portal (data.go.kr) Technical Spec.

## 1. Overview
Provides short-term weather forecasts for specific grid coordinates.

## 2. API Endpoint
*   **Base URL**: `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`

## 3. Request Parameters (Verified)
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `serviceKey` | String | **Yes** | API Key (Already Encoded) |
| `base_date` | String | **Yes** | YYYYMMDD |
| `base_time` | String | **Yes** | HHMM (e.g., 0500) |
| `nx`, `ny` | Int | **Yes** | Grid Coordinates |
| `dataType` | String | No | `JSON` or `XML` |

## 4. Base Time Rules
Data is updated every 3 hours starting from 02:00.
*   `0200`, `0500`, `0800`, `1100`, `1400`, `1700`, `2000`, `2300`

## 5. Output Data (Category Codes)
| Code | Meaning | Unit |
| :--- | :--- | :--- |
| `TMP` | 1hr Temperature | ℃ |
| `REH` | Humidity | % |
| `SKY` | Sky Status | 1(Clean), 3(Cloudy), 4(Overcast) |
| `PTY` | Precipitation | 0(None), 1(Rain), 2(Sleet), 3(Snow) |

## 6. Important Notes
*   **Coordinates**: Use the KMA's specific `nx, ny` grid system, not standard Lat/Lon.
*   **Encoding**: Do *not* double-encode the Service Key.
