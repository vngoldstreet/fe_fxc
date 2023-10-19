package main

import (
	"fmt"
	"net/http"
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
	r.GET("/user", func(c *gin.Context) {
		c.HTML(http.StatusOK, "user.html", gin.H{
			"title": "User",
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
		c.HTML(http.StatusOK, "history.html", gin.H{
			"title": "Leader board",
		})
	})
	r.Run(":4200")

}
