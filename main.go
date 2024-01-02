package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
)

var (
	// key must be 16, 24 or 32 bytes long (AES-128, AES-192 or AES-256)
	key   = []byte("super-secret-key")
	store = sessions.NewCookieStore(key)
)

func main() {
	r := gin.Default()
	r.Static("/src/assets", "./src/assets")
	r.LoadHTMLGlob("src/html/*")
	r.Use(
		cors.New(cors.Config{
			AllowOrigins: []string{"*"},
			AllowMethods: []string{"POST", "OPTIONS", "GET", "PUT", "DELETE"},
			AllowHeaders: []string{"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, ResponseType, accept, origin, Cache-Control, X-Requested-With"},
			// ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))
	r.GET("/", func(c *gin.Context) {
		myToken, err := c.Cookie("token")
		if err != nil {
			c.HTML(http.StatusOK, "authentication-login.html", gin.H{
				"title": "Login",
			})
			return
		}

		greetingUrl := "https://auth.fxchampionship.com/auth/greetings"
		// Create a new HTTP client
		client := &http.Client{}

		// Create a new GET request
		req, err := http.NewRequest("GET", greetingUrl, nil)
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
			}
			transaction := Transactions{
				TypeString: title,
				ContestID:  v.ContestID,
				CreatedAt:  v.CreatedAt.Format("2006-01-02 15:04:05"),
				UpdatedAt:  v.UpdatedAt.Format("2006-01-02 15:04:05"),
				Amount:     formatNumberWithComma(v.Amount),
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
			totalPrize := v.Account * v.Amount * 70 / 100

			contest := ContestLists{
				ID:         i + 1,
				ContestID:  v.ContestID,
				StartAt:    v.StartAt.Format("2006-01-02 15:04:05"),
				ExpireAt:   v.ExpiredAt.Format("2006-01-02 15:04:05"),
				Amount:     formatNumberWithComma(v.Amount),
				Joined:     fmt.Sprintf("%d/%d", v.CurrentPerson, v.MaximumPerson),
				TotalPrize: formatNumberWithComma(totalPrize),
				Balance:    formatNumberWithComma(v.StartBalance),
				Status:     status,
				Class:      class,
			}
			contests = append(contests, contest)
		}
		session, _ := store.Get(c.Request, "mysession")
		session.Values["data"] = greetingData.Chart

		c.HTML(http.StatusOK, "dashboard.html", gin.H{
			"title":          "Dashbard",
			"data":           greetingData,
			"wallet_balance": formatNumberWithComma(greetingData.Wallet.Balance),
			"wallet_updated": greetingData.Wallet.UpdatedAt.Format("2006-01-02 15:04:05"),
			"notifications":  notifications,
			"transactions":   transactions,
			"contests":       contests,
		})
	})
	r.GET("/login", func(c *gin.Context) {
		c.HTML(http.StatusOK, "authentication-login.html", gin.H{
			"title": "Login",
		})
	})
	r.GET("/reset-password", func(c *gin.Context) {
		c.HTML(http.StatusOK, "authentication-reset-password.html", gin.H{
			"title": "Reset Password",
		})
	})
	r.GET("/register", func(c *gin.Context) {
		code := c.Query("partner")
		c.HTML(http.StatusOK, "authentication-register.html", gin.H{
			"title": "Register",
			"code":  code,
		})
	})
	r.GET("/user", func(c *gin.Context) {
		c.HTML(http.StatusOK, "user.html", gin.H{
			"title": "User",
		})
	})
	r.GET("/my-competitions", func(c *gin.Context) {
		myToken, err := c.Cookie("token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
			return
		}

		requestUrl := "https://auth.fxchampionship.com/auth/contest/get-contest-by-uid"
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
			fmt.Println("Error decoding response:", err)
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

		c.HTML(http.StatusOK, "competition.html", gin.H{
			"title": "My Competitions",
			"data":  responseData.Data,
		})
	})
	r.GET("/security", func(c *gin.Context) {
		c.HTML(http.StatusOK, "security.html", gin.H{
			"title": "Security",
		})
	})
	// r.GET("/history", func(c *gin.Context) {
	// 	c.HTML(http.StatusOK, "history.html", gin.H{
	// 		"title": "Leader board",
	// 	})
	// })
	r.GET("/leader-board", func(c *gin.Context) {
		c.HTML(http.StatusOK, "leaderboard.html", gin.H{
			"title": "Leader board",
		})
	})
	r.GET("/partner", func(c *gin.Context) {
		c.HTML(http.StatusOK, "partners.html", gin.H{
			"title": "Partner",
		})
	})
	r.POST("/api/reset-password", ResetPasswordHandle)

	r.GET("/api/chart", func(c *gin.Context) {
		myToken, err := c.Cookie("token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
			return
		}

		greetingUrl := "https://auth.fxchampionship.com/auth/greetings"
		// Create a new HTTP client
		client := &http.Client{}

		// Create a new GET request
		req, err := http.NewRequest("GET", greetingUrl, nil)
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

		var greetingData Greetings
		if err := json.NewDecoder(resp.Body).Decode(&greetingData); err != nil {
			fmt.Println("Error decoding response:", err)
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"chart": greetingData.Chart,
		})
	})
	r.Run(":4200")
}

type ResetPassword struct {
	Email string `json:"email" binding:"required"`
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

type Notification struct {
	Time    string
	Title   string
	Message string
	Type    int
}

type Transactions struct {
	TypeString string
	ContestID  string
	CreatedAt  string
	UpdatedAt  string
	Amount     string
	Status     string
	Class      string
	Background string
	TypeID     int
	TranID     int
}

type ContestLists struct {
	ID         int
	ContestID  string
	StartAt    string
	ExpireAt   string
	Amount     string
	Joined     string
	TotalPrize string
	Balance    string
	Status     string
	Class      string
}

type Greetings struct {
	Message string `json:"message"`
	User    struct {
		ID          int       `json:"ID"`
		CreatedAt   time.Time `json:"CreatedAt"`
		UpdatedAt   time.Time `json:"UpdatedAt"`
		DeletedAt   any       `json:"DeletedAt"`
		Name        string    `json:"name"`
		Email       string    `json:"email"`
		Phone       string    `json:"phone"`
		Password    string    `json:"password"`
		PartnerCode string    `json:"partner_code"`
		Image       string    `json:"image"`
		Description string    `json:"description"`
		RefLink     string    `json:"ref_link"`
		InReview    string    `json:"in_review"`
		IsTest      int       `json:"is_test"`
	} `json:"user"`
	Wallet struct {
		ID         int       `json:"ID"`
		CreatedAt  time.Time `json:"CreatedAt"`
		UpdatedAt  time.Time `json:"UpdatedAt"`
		DeletedAt  any       `json:"DeletedAt"`
		CustomerID int       `json:"customer_id"`
		Balance    int       `json:"balance"`
		LastChange int       `json:"last_change"`
	} `json:"wallet"`
	Transactions []struct {
		ID            int       `json:"ID"`
		CreatedAt     time.Time `json:"CreatedAt"`
		UpdatedAt     time.Time `json:"UpdatedAt"`
		DeletedAt     any       `json:"DeletedAt"`
		TypeID        int       `json:"type_id"`
		CustomerID    int       `json:"customer_id"`
		CBalance      int       `json:"c_balance"`
		Amount        int       `json:"amount"`
		NBalance      int       `json:"n_balance"`
		PaymentMethob int       `json:"payment_methob"`
		PaymentGate   int       `json:"payment_gate"`
		StatusID      int       `json:"status_id"`
		ParentID      int       `json:"parent_id"`
		ContestID     string    `json:"contest_id"`
	} `json:"transactions"`
	Chart struct {
		Dep      []int    `json:"dep"`
		Withdraw []int    `json:"withdraw"`
		Earn     []int    `json:"earn"`
		Date     []string `json:"date"`
	} `json:"chart"`
	Notification []struct {
		ID         int       `json:"ID"`
		CreatedAt  time.Time `json:"CreatedAt"`
		UpdatedAt  time.Time `json:"UpdatedAt"`
		DeletedAt  any       `json:"DeletedAt"`
		CustomerID int       `json:"customer_id"`
		Type       int       `json:"type"`
		Message    string    `json:"message"`
		IsSend     int       `json:"is_send"`
	} `json:"notification"`
	ContestList []struct {
		ID            int       `json:"ID"`
		CreatedAt     time.Time `json:"CreatedAt"`
		UpdatedAt     time.Time `json:"UpdatedAt"`
		DeletedAt     any       `json:"DeletedAt"`
		ContestID     string    `json:"contest_id"`
		Amount        int       `json:"amount"`
		MaximumPerson int       `json:"maximum_person"`
		CurrentPerson int       `json:"current_person"`
		StartAt       time.Time `json:"start_at"`
		ExpiredAt     time.Time `json:"expired_at"`
		StartBalance  int       `json:"start_balance"`
		EstimateTime  time.Time `json:"estimate_time"`
		StatusID      int       `json:"status_id"`
		Account       int       `json:"account"`
	} `json:"contest_list"`
}
