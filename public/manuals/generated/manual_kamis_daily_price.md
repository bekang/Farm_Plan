# KAMIS Daily Price API Manual
**Service**: 일일 도소매 가격 정보 (Daily Price)
**Source**: Korea Agro-Fisheries & Food Trade Corp (aT)
**Verification**: Verified via KAMIS Open API Official Guide & data.go.kr.

## 1. Overview
Provides daily wholesale and retail prices for agricultural products.

## 2. API Endpoint
*   **XML**: `http://www.kamis.or.kr/service/price/xml.do`
*   **JSON**: `http://www.kamis.or.kr/service/price/json.do`

## 3. Request Parameters (Verified)
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `p_cert_key` | String | **Yes** | API Key | `e164...` |
| `p_cert_id` | String | **Yes** | Client ID | `7036` (Example) |
| `p_returntype` | String | No | Format | `json` or `xml` |
| `p_regday` | Date | **Yes** | Date | `2024-01-04` |
| `p_item_category_code` | Code | No | Category | `100`(Food), `200`(Veg) |

## 4. Common Response Codes
*   `000`: Success
*   `001`: No Data (Common on Weekends/Holidays)
*   `999`: Auth Failed

## 5. Important Notes
*   **Price Formatting**: Prices are returned with commas (e.g. "1,500"). **Must remove commas** before numerical analysis.
*   **History**: The API returns data for a single day. For ranges, you must iterate `p_regday`.
