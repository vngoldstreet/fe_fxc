package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	r := gin.Default()
	r.Static("/src/assets", "./src/assets")
	r.LoadHTMLGlob("src/html/*")
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"POST", "OPTIONS", "GET", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, ResponseType, accept, origin, Cache-Control, X-Requested-With"},
		// ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
		return
	}
	apiUrl := os.Getenv("API_URL")
	apiGetWallet := os.Getenv("API_GET_WALLET")
	apiDeposit := os.Getenv("API_DEPOSIT")
	apiWithdraw := os.Getenv("API_WITHDRAW")
	apiGetHistoriesTransaction := os.Getenv("API_GET_HISTORIES")
	apiGetDepWithdraw := os.Getenv("API_GET_DPERW")
	apiGetContestByID := os.Getenv("API_GET_CONTEST_BYID")
	apiGETAllContest := os.Getenv("API_GET_CONTEST")
	apiJoinAContest := os.Getenv("API_JOIN_A_CONTEST")
	r.GET("/get-env", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"API_URL":              apiUrl,
			"API_GET_WALLET":       apiGetWallet,
			"API_DEPOSIT":          apiDeposit,
			"API_WITHDRAW":         apiWithdraw,
			"API_GET_HISTORIES":    apiGetHistoriesTransaction,
			"API_GET_DPERW":        apiGetDepWithdraw,
			"API_GET_CONTEST_BYID": apiGetContestByID,
			"API_GET_CONTEST":      apiGETAllContest,
			"API_JOIN_A_CONTEST":   apiJoinAContest,
		})
	})
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "dashboard.html", gin.H{
			"title": "Dashbard",
		})
	})
	r.GET("/login", func(c *gin.Context) {
		c.HTML(http.StatusOK, "authentication-login.html", gin.H{
			"title": "Login",
		})
	})
	r.GET("/register", func(c *gin.Context) {
		code := c.Query("partner")
		c.HTML(http.StatusOK, "authentication-register.html", gin.H{
			"title": "Register",
			"code":  code,
		})
	})
	r.Run(":4200")

}
