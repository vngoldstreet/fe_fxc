package main

import (
	"bytes"
	"fmt"
	"net/http"
)

// RequestFunction là một hàm chung để thực hiện các loại request khác nhau (GET, POST, PUT, vv.)
type RequestFunction func(client *http.Client, url string, token string, body []byte) (*http.Response, error)

// PerformRequest là hàm chung để thực hiện các loại request khác nhau
func PerformRequest(client *http.Client, method string, url string, token string, body []byte) (*http.Response, error) {
	req, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json") // Thay đổi kiểu nếu cần thiết

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error sending request: %v", err)
	}

	return resp, nil
}

// ExampleGetRequest là một ví dụ sử dụng PerformRequest để thực hiện GET request
func ExampleGetRequest(url string, token string) (*http.Response, error) {
	client := &http.Client{}
	mutex.Lock()
	defer mutex.Unlock()
	return PerformRequest(client, "GET", url, token, nil)
}

// ExamplePostRequest là một ví dụ sử dụng PerformRequest để thực hiện POST request với dữ liệu body
func ExamplePostRequest(url string, token string, body []byte) (*http.Response, error) {
	client := &http.Client{}
	mutex.Lock()
	defer mutex.Unlock()
	return PerformRequest(client, "POST", url, token, body)
}
