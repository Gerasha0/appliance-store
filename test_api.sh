#!/bin/bash
echo "=== Тестирование API Appliance Store ==="
echo ""
# 1. Логин Employee
echo "1. Логин Employee (phobos@epam.com):"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"phobos@epam.com","password":"password123"}')
echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""
# 2. Получить производителей (с токеном)
echo "2. Получить список производителей (GET /api/manufacturers):"
curl -s http://localhost:8080/api/manufacturers \
  -H "Authorization: Bearer $TOKEN" | jq '. | {total: .totalElements, size: .size, manufacturers: .content[].name}'
echo ""
# 3. Получить приборы
echo "3. Получить список приборов (GET /api/appliances):"
curl -s http://localhost:8080/api/appliances \
  -H "Authorization: Bearer $TOKEN" | jq '. | {total: .totalElements, appliances: .content[] | {id, name, category, price}}'
echo ""
# 4. Попытка доступа без токена
echo "4. Попытка доступа без токена (должен вернуть 401):"
curl -s -w "\nHTTP Status: %{http_code}\n" http://localhost:8080/api/employees
echo ""
# 5. Логин Client
echo "5. Логин Client (mercury@client.com):"
CLIENT_LOGIN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mercury@client.com","password":"password123"}')
echo "$CLIENT_LOGIN" | jq '.'
CLIENT_TOKEN=$(echo "$CLIENT_LOGIN" | jq -r '.token')
echo ""
# 6. Client пытается получить доступ к employees (должен вернуть 403)
echo "6. Client пытается получить список сотрудников (должен вернуть 403 Forbidden):"
curl -s -w "\nHTTP Status: %{http_code}\n" http://localhost:8080/api/employees \
  -H "Authorization: Bearer $CLIENT_TOKEN"
echo ""
echo "=== Тестирование завершено ==="
