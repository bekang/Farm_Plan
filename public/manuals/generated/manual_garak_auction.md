# Garak Market Auction API Manual
**Service**: 가락시장 경매 낙찰 정보 (Auction Result)
**Source**: Seoul Agro-Fisheries & Food Corp (Garakt)
**Verification**: Based on legacy `dataJsonOpen.do` usage patterns.

## 1. Overview
Real-time electronic auction results from Garak Market.

## 2. API Endpoint
*   **Base URL**: `http://www.garak.co.kr/homepage/publicdata/dataJsonOpen.do`

## 3. Request Parameters (Essential)
| Parameter | Type | Required | Description | Value |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | **Yes** | User ID | `5775` |
| `passwd` | String | **Yes** | Password | `****` |
| `dataid` | String | **Yes** | Function ID | `data36` |
| `s_date` | String | **Yes** | Date (YYYYMMDD) | `20241120` |
| `s_pummok` | String | No | Item Name | `양파` |

## 4. Response Fields
| Field | Name | Description |
| :--- | :--- | :--- |
| `PUM_NM` | Item Name | e.g. Onion |
| `U_NAME` | Unit | e.g. 20kg |
| `AV_P` | Avg Price | KRW |

## 5. Troubleshooting
*   **Password Characters**: If password contains special chars, ensure standard URL encoding isn't breaking the older backend parser.
*   **Empty Response**: Often means `s_date` is a Sunday or holiday (Market Closed).
