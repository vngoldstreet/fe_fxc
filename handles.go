package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func getCharts(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_HOME_GET_CHART"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var greetingData Greetings
	if err := json.NewDecoder(resp.Body).Decode(&greetingData); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"chart": greetingData.Chart,
	})
}

func ResetPasswordHandle(c *gin.Context) {
	var input ResetPassword
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jsonData, err := json.Marshal(input)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return
	}

	// Send the POST request with JSON body
	resp, err := http.Post("https://admin.fxchampionship.com/public/reset-password", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error sending POST request:", err)
		return
	}
	defer resp.Body.Close()

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		fmt.Println("Unexpected status code:", resp.Status)
		return
	}

	// Read the response body if needed
	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		fmt.Println("Error decoding response:", err)
		return
	}

	// Print the result
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func formatNumberWithComma(number int) string {
	strNumber := strconv.Itoa(number)
	var formattedNumber []rune

	for i := len(strNumber) - 1; i >= 0; i-- {
		formattedNumber = append(formattedNumber, []rune(strNumber)[i])
		if i > 0 && (len(strNumber)-i)%3 == 0 {
			formattedNumber = append(formattedNumber, ',')
		}
	}

	for i, j := 0, len(formattedNumber)-1; i < j; i, j = i+1, j-1 {
		formattedNumber[i], formattedNumber[j] = formattedNumber[j], formattedNumber[i]
	}

	return string(formattedNumber)
}

func formatNumberFloatWithComma(number float64) string {
	strNumber := fmt.Sprintf("%.0f", number)
	var formattedNumber []rune

	for i := len(strNumber) - 1; i >= 0; i-- {
		formattedNumber = append(formattedNumber, []rune(strNumber)[i])
		if i > 0 && (len(strNumber)-i)%3 == 0 {
			formattedNumber = append(formattedNumber, ',')
		}
	}

	for i, j := 0, len(formattedNumber)-1; i < j; i, j = i+1, j-1 {
		formattedNumber[i], formattedNumber[j] = formattedNumber[j], formattedNumber[i]
	}

	return string(formattedNumber)
}

func getHomepage(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil || myToken == "" {
		c.HTML(http.StatusOK, "authentication-login.html", gin.H{
			"title": "Login",
		})
		return
	}

	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_HOME_GREETING"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var greetingData Greetings
	if err := json.NewDecoder(resp.Body).Decode(&greetingData); err != nil {
		fmt.Println("Error decoding response:", err)
		return
	}
	notifications := []Notification{}

	for _, v := range greetingData.Notification {
		title := ""
		switch v.Type {
		case 1:
			title = "Deposit"
		case 2:
			title = "Withdrawal"
		case 3:
			title = "Join a contest"
		case 4:
			title = "Re-join a contest"
		}
		notification := Notification{
			Time:    v.CreatedAt.Format("06-01-02"),
			Title:   title,
			Message: v.Message,
			Type:    v.Type,
		}
		notifications = append(notifications, notification)
	}

	transactions := []Transactions{}
	for _, v := range greetingData.Transactions {
		title := ""
		switch v.TypeID {
		case 1:
			title = "Deposit"
		case 2:
			title = "Withdrawal"
		case 3, 5:
			title = "Earning"
		case 4:
			title = "Join a contest"
		case 6:
			title = "Re-Join a contest"
		}
		status := ""
		class := ""
		background := ""
		switch v.StatusID {
		case 1:
			status = "Processing"
			class = "text-warning"
			background = "bg-warning"
		case 2:
			status = "Success"
			class = "text-success"
			background = "bg-success"
		case 3:
			status = "Cancelled"
			class = "text-danger"
			background = "bg-danger"
		default:
			status = "Pending"
			class = "text-success"
			background = "bg-success"
		}
		transaction := Transactions{
			TypeString: title,
			ContestID:  v.ContestID,
			CreatedAt:  v.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt:  v.UpdatedAt.Format("2006-01-02 15:04:05"),
			Amount:     formatNumberFloatWithComma(v.Amount),
			Class:      class,
			Background: background,
			Status:     status,
			TypeID:     v.TypeID,
			TranID:     v.ID,
		}
		transactions = append(transactions, transaction)
	}

	contests := []ContestLists{}
	for i, v := range greetingData.ContestList {
		status := ""
		class := ""
		switch v.StatusID {
		case 0:
			status = "Pending"
			class = "bg-primary"
		case 1:
			status = "Processing"
			class = "bg-warning"
		case 2:
			status = "Finished"
			class = "bg-success"
		case 3:
			status = "Cancelled"
			class = "text-danger"
		}
		totalPrize := v.Account * v.Amount * 70 / 100

		contest := ContestLists{
			ID:         i + 1,
			ContestID:  v.ContestID,
			StartAt:    v.StartAt.Format("2006-01-02 15:04:05"),
			ExpireAt:   v.ExpiredAt.Format("2006-01-02 15:04:05"),
			Amount:     formatNumberWithComma(v.Amount),
			Joined:     fmt.Sprintf("%d/%d", v.CurrentPerson, v.MaximumPerson),
			TotalPrize: formatNumberWithComma(totalPrize),
			Balance:    formatNumberFloatWithComma(v.StartBalance),
			Status:     status,
			Class:      class,
		}
		contests = append(contests, contest)
	}

	c.HTML(http.StatusOK, "dashboard.html", gin.H{
		"title":          "Dashbard",
		"data":           greetingData,
		"wallet_balance": formatNumberFloatWithComma(greetingData.Wallet.Balance),
		"wallet_updated": greetingData.Wallet.UpdatedAt.Format("2006-01-02 15:04:05"),
		"notifications":  notifications,
		"transactions":   transactions,
		"contests":       contests,
	})
}

func getCompetitionPage(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil || myToken == "" {
		c.HTML(http.StatusOK, "authentication-login.html", gin.H{
			"title": "Login",
		})
		return
	}

	requestUrl := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_COMPETITION_GET_CONTEST"))
	// Create a new HTTP client
	client := &http.Client{}

	// Create a new GET request
	req, err := http.NewRequest("GET", requestUrl, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	// Add the Bearer token to the request header
	req.Header.Set("Authorization", "Bearer "+myToken)

	// Send the request
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failure"})
		return
	}

	defer resp.Body.Close()

	var responseData CompetitionDataResponses
	if err := json.NewDecoder(resp.Body).Decode(&responseData); err != nil {
		fmt.Println("Error decoding response 1:", err)
		return
	}

	for i := range responseData.Data {
		v := &responseData.Data[i]
		v.BuyinStatus = false
		percent := v.Balance / v.StartBalance * 100
		if percent < 5 {
			v.BuyinStatus = true
		}
	}

	requestHistoryUrl := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_COMPETITION_GET_HISTORY_CONTEST"))
	// Create a new HTTP client
	clientHistory := &http.Client{}

	// Create a new GET request
	reqHis, errHis := http.NewRequest("GET", requestHistoryUrl, nil)
	if errHis != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	// Add the Bearer token to the request header
	reqHis.Header.Set("Authorization", "Bearer "+myToken)

	// Send the request
	respHistory, err2 := clientHistory.Do(reqHis)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failure"})
		return
	}

	defer respHistory.Body.Close()

	var responseHistory HistoryCompetitions
	if err := json.NewDecoder(respHistory.Body).Decode(&responseHistory); err != nil {
		fmt.Println("Error decoding response 2:", err)
		return
	}

	stringResponseHistory := []HistoryCompetitionPrints{}
	for _, v := range responseHistory.Data {
		status := ""
		class := ""
		switch v.StatusID {
		case 0:
			status = "Pending"
			class = "bg-light"
		case 1:
			status = "Processing"
			class = "bg-warning"
		case 2:
			status = "Finished"
			class = "bg-success"
		case 3:
			status = "Cancelled"
			class = "text-danger"
		}
		grow := (v.Balance - v.StartBalance) / v.StartBalance * 100
		strGrow := fmt.Sprintf("%.2f", grow)
		history := HistoryCompetitionPrints{
			ContestID:    v.ContestID,
			CustomerID:   v.CustomerID,
			FxID:         v.FxID,
			FxMasterPw:   v.FxMasterPw,
			FxInvesterPw: v.FxInvesterPw,
			StatusID:     status,
			Balance:      formatNumberFloatWithComma(v.Balance),
			Equity:       formatNumberFloatWithComma(v.Equity),
			Profit:       formatNumberFloatWithComma(v.Profit),
			StartBalance: formatNumberFloatWithComma(v.StartBalance),
			Rank:         v.Rank,
			StartAt:      v.StartAt.Format("2006-01-02 15:04:05"),
			ExpiredAt:    v.ExpiredAt.Format("2006-01-02 15:04:05"),
			Class:        class,
			Growth:       strGrow,
		}
		stringResponseHistory = append(stringResponseHistory, history)
	}

	c.HTML(http.StatusOK, "competition.html", gin.H{
		"title":   "My Competitions",
		"data":    responseData.Data,
		"contest": stringResponseHistory,
	})
}

func getPromoCode(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	requestPromo := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_COMPETITION_PROMO"))

	resp, err := ExampleGetRequest(requestPromo, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var promoCodeResponse PromoCodeResponse
	if err := json.NewDecoder(resp.Body).Decode(&promoCodeResponse); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, promoCodeResponse.Data)
}

func apiRejoinContest(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input InputRejoins
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_COMPETITION_REJOIN"))
	if input.PromoCode != "" {
		url = fmt.Sprintf("%s%s?promo_code=%s", os.Getenv("API_BASE_URL"), os.Getenv("API_COMPETITION_REJOIN"), input.PromoCode)
	}
	postData := []byte(fmt.Sprintf(`{"contest_id": "%s"}`, input.ContestID))
	respPost, errPost := ExamplePostRequest(url, myToken, postData)
	if errPost != nil {
		fmt.Println("Error errPost:", errPost)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errPost,
		})
		return
	}
	defer respPost.Body.Close()

	if respPost.StatusCode == 429 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Don't operate too quickly!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	if respPost.StatusCode != 200 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failure!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Success to re-join: %s", input.ContestID),
	})
}

func getLeaderBoardPage(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil || myToken == "" {
		c.HTML(http.StatusOK, "authentication-login.html", gin.H{
			"title": "Login",
		})
		return
	}
	c.HTML(http.StatusOK, "leaderboard.html", gin.H{
		"title": "Leader board",
	})
}

func apiListContestByUID(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_LEADERBOARD_GETCONTEST"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var response ResponseLeaderBoards
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, response.Data)
}

func apiLeaderBoardByContestID(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input InputLeaderBoards
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	urlRequest := fmt.Sprintf("%s%s?contest_id=%s", os.Getenv("API_BASE_URL"), os.Getenv("API_LEADERBOARD_GET_LEADERBOARD"), input.ContestID)
	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	defer resp.Body.Close()

	var response LeaderBoardByContestID
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}

	c.JSON(http.StatusOK, response)
}

func apiLogin(c *gin.Context) {
	var input InputLogin
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_LOGIN"))
	postData := []byte(fmt.Sprintf(`{"email": "%s","password":"%s"}`, input.Email, input.Password))
	respPost, errPost := ExamplePostRequest(url, "", postData)
	if errPost != nil {
		fmt.Println("Error errPost:", errPost)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errPost,
		})
		return
	}
	defer respPost.Body.Close()

	var response ResponseLogin
	if err := json.NewDecoder(respPost.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	if response.Token == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Incorrect username or password",
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func apiWithdrawal(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	var input InputWithdrawal
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_HOME_WITHDRAWAL"))
	postData := []byte(fmt.Sprintf(`{"amount": %d,"payment_methob":%d}`, input.Amount, input.PaymentMethob))
	respPost, errPost := ExamplePostRequest(url, myToken, postData)
	if errPost != nil {
		fmt.Println("Error errPost:", errPost)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errPost,
		})
		return
	}
	defer respPost.Body.Close()

	if respPost.StatusCode == 429 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Don't operate too quickly!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	if respPost.StatusCode != 200 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failure!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("You have successfully initiated a withdrawal request: %d Gold.", input.Amount),
		"class":   "text-success",
		"code":    respPost.StatusCode,
	})
}

func apiDeposit(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	var input InputDeposit
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_HOME_DEPOSIT"))
	postData := []byte(fmt.Sprintf(`{"amount": %d}`, input.Amount))
	respPost, errPost := ExamplePostRequest(url, myToken, postData)
	if errPost != nil {
		fmt.Println("Error errPost:", errPost)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errPost,
		})
		return
	}
	defer respPost.Body.Close()

	var response ResponseUserDeposit
	if err := json.NewDecoder(respPost.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}

	if respPost.StatusCode == 429 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Don't operate too quickly!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}
	if respPost.StatusCode != 200 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Failure!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Please use your banking app to scan the QRcode or transfer to the account number as instructed. Thank you!",
		"class":   "text-success",
		"code":    respPost.StatusCode,
		"data":    response.Data,
	})
}

func apiJoinContest(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	var input InputJoinContest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_HOME_JOINCONTEST"))
	postData := []byte(fmt.Sprintf(`{"contest_id": "%s"}`, input.ContestID))
	respPost, errPost := ExamplePostRequest(url, myToken, postData)
	if errPost != nil {
		fmt.Println("Error errPost:", errPost)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errPost,
		})
		return
	}

	defer respPost.Body.Close()

	if respPost.StatusCode == 429 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Don't operate too quickly!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	if respPost.StatusCode != 200 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Failure!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}
	var response ResponseUserJoinContest
	if err := json.NewDecoder(respPost.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": response.Message,
		"class":   response.Class,
		"code":    http.StatusOK,
	})
}

func apiGetPaymentMethob(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_HOME_GET_PAYMENT_METHOB"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var response ReponsePaymentMethob
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, response.Data)
}

func apiGetUserInfo(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_HOME_GET_USER_INFO"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var response ResponseUser
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, response.Data)
}

func apiGetWallet(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_HOME_GET_WALLET"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var response ResponseUserWallet
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, response.Data)
}

func apiGetCustomer(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_PARTNER"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var response ResponsePartner
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, response.Data)
}

func apiCheckDeposit(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_CHECK_DEPOSIT"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var response ResponseCheckDeposit
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, response)
}

func apiCheckInreview(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}
	urlRequest := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_USER_GET_INDENTIFY"))

	resp, err := ExampleGetRequest(urlRequest, myToken)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var response IndentifyInfo
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}
	c.JSON(http.StatusOK, response.Data)
}

func apiCreatePaymentMethob(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input InputCreatePaymentMehob
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_USER_CREATE_PAYMENT_METHOB"))
	postData := []byte(fmt.Sprintf(`{"holder_name": "%s","holder_number": "%s","bank_name": "%s","is_card": %d}`, input.HolderName, input.HolderNumber, input.BankName, input.IsCard))

	respPost, errPost := ExamplePostRequest(url, myToken, postData)
	if errPost != nil {
		fmt.Println("Error errPost:", errPost)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errPost,
		})
		return
	}

	defer respPost.Body.Close()

	if respPost.StatusCode == 429 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Don't operate too quickly!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	if respPost.StatusCode != 200 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Failure!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	var response ResponseUserJoinContest
	if err := json.NewDecoder(respPost.Body).Decode(&response); err != nil {
		fmt.Println("Error decoding response 3:", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": response.Message,
		"class":   response.Class,
		"code":    http.StatusOK,
	})
}

func apiIndentifyUpdate(c *gin.Context) {
	myToken, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input InputIndentify
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s%s", os.Getenv("API_BASE_URL"), os.Getenv("API_USER_INDENTIFY_UPDATE"))
	postData := []byte(fmt.Sprintf(`{"image_front": "%s","image_back": "%s"}`, input.ImageFront, input.ImageBack))

	respPost, errPost := ExamplePostRequest(url, myToken, postData)
	if errPost != nil {
		fmt.Println("Error errPost:", errPost)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errPost,
		})
		return
	}

	defer respPost.Body.Close()

	if respPost.StatusCode == 429 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Don't operate too quickly!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	if respPost.StatusCode != 200 {
		c.JSON(http.StatusOK, gin.H{
			"message": "Failure!",
			"class":   "text-danger",
			"code":    respPost.StatusCode,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"class": "text-success",
		"code":  respPost.StatusCode,
	})
}
