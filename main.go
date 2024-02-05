package main

import (
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Error loading .env file")
	}
}

var mutex sync.Mutex

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
	r.GET("/", getHomepage)
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
		myToken, err := c.Cookie("token")
		if err != nil || myToken == "" {
			c.HTML(http.StatusOK, "authentication-login.html", gin.H{
				"title": "Login",
			})
			return
		}
		c.HTML(http.StatusOK, "user.html", gin.H{
			"title": "User",
		})
	})
	r.GET("/my-competitions", getCompetitionPage)
	r.GET("/security", func(c *gin.Context) {
		myToken, err := c.Cookie("token")
		if err != nil || myToken == "" {
			c.HTML(http.StatusOK, "authentication-login.html", gin.H{
				"title": "Login",
			})
			return
		}
		c.HTML(http.StatusOK, "security.html", gin.H{
			"title": "Security",
		})
	})
	r.GET("/leader-board", getLeaderBoardPage)
	r.GET("/partner", func(c *gin.Context) {
		myToken, err := c.Cookie("token")
		if err != nil || myToken == "" {
			c.HTML(http.StatusOK, "authentication-login.html", gin.H{
				"title": "Login",
			})
			return
		}
		c.HTML(http.StatusOK, "partners.html", gin.H{
			"title": "Partner",
		})
	})

	//Api local
	api := r.Group("/api")
	{
		api.GET("/chart", getCharts)
		api.GET("/get-promotion", getPromoCode)
		api.GET("/get-contest-by-uid", apiListContestByUID)
		api.GET("/get-payment-methob", apiGetPaymentMethob)
		api.GET("/get-user-info", apiGetUserInfo)
		api.GET("/get-wallet", apiGetWallet)
		api.GET("/get-customer", apiGetCustomer)
		api.GET("/get-commission-level", apiCommissionLevel)
		api.GET("/get-commission-level-by-id", apiCommissionLevelByID)
		api.GET("/get-commission-by-partner-id", apiGetCommissionByPartnerID)
		api.GET("/check-deposit", apiCheckDeposit)
		api.GET("/get-indentify", apiCheckInreview)
		api.GET("/get-investor-password", apiGetInvestorPassword)

		api.POST("/reset-password", ResetPasswordHandle)
		api.POST("/rejoin-a-competition", apiRejoinContest)
		api.POST("/get-leaderboard-by-contestid", apiLeaderBoardByContestID)
		api.POST("/login", apiLogin)
		api.POST("/withdrawal", apiWithdrawal)
		api.POST("/deposit", apiDeposit)
		api.POST("/join-contest", apiJoinContest)
		api.POST("/create-payment-method", apiCreatePaymentMethob)
		api.POST("/indentify-update", apiIndentifyUpdate)
		api.POST("/commission-update", apiCommissionUpdate)
	}

	r.Run(":4200")
}
