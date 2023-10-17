package main

import (
	"time"

	"gorm.io/gorm"
)

// Users
type CpsUsers struct {
	gorm.Model
	Name        string `json:"name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Password    string `json:"password"`
	PartnerCode string `json:"code"`
	Image       string `json:"image"`
	Description string `json:"description"`
	RefLink     string `json:"ref_link"`
	InReview    string `json:"inreview" gorm:"default:not_yet"`
}

type CpsReviews struct {
	gorm.Model
	CustomerID uint   `json:"customer_id"`
	ImageFront string `json:"image_front"`
	ImageBack  string `json:"image_back"`
	Status     string `json:"status"`
}

type RegisterInput struct {
	Name        string `json:"name" binding:"required"`
	Email       string `json:"email" binding:"required"`
	Password    string `json:"password" binding:"required"`
	Phone       string `json:"phone" binding:"required"`
	PartnerCode string `json:"parnercode"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type CpsWallets struct {
	gorm.Model
	CustomerID uint    `json:"customer_id"`
	Balance    float64 `json:"balance"`
	LastChange float64 `json:"last_change"`
}

// Partners
type CpsPartners struct {
	gorm.Model
	ParentID int    `json:"parent_id"`
	ChildID  int    `json:"child_id"`
	Path     string `json:"path"`
}

// Transaction
type CpsTransactions struct {
	gorm.Model
	TypeID        int     `json:"type_id"`
	CustomerID    uint    `json:"customer_id"`
	CBalance      float64 `json:"c_balance"`
	Amount        float64 `json:"amount"`
	NBalance      float64 `json:"n_balance"`
	PaymentMethob int     `json:"payment_methob"`
	PaymentGate   int     `json:"payment_gate"`
	StatusID      int     `json:"status_id"`
	ParentID      int     `json:"parent_id"`
	ContestID     string  `json:"contest_id"`
}
type CpsTransactionTypes struct {
	gorm.Model
	Type        int    `json:"type"`
	Description string `json:"description"`
}

type CpsTransactionStatus struct {
	gorm.Model
	Status      int    `json:"status"`
	Description string `json:"description"`
}

type CpsPaymentMethobs struct {
	gorm.Model
	CustomerID   uint   `json:"customer_id"`
	HolderName   string `json:"holder_name"`
	HolderNumber string `json:"holder_number"`
	BankName     string `json:"bank_name"`
	IsCard       int    `json:"is_card" gorm:"default:0"`
}

type CpsPaymentGates struct {
	gorm.Model
	Status      int    `json:"status"`
	Description string `json:"description"`
}

type CpsNotifications struct {
	gorm.Model
	CustomerID uint   `json:"customer_id"`
	Type       int    `json:"type"`
	Message    string `json:"message"`
	IsSent     int    `json:"is_send" gorm:"default:0"`
}

// Contest
type ListContests struct {
	gorm.Model
	ContestID     string    `json:"contest_id"`
	Amount        float64   `json:"amount"`
	MaximumPerson int       `json:"maximum_person"`
	CurrentPerson int       `json:"current_person" gorm:"default:0"`
	Start_at      time.Time `json:"start_at"`
	Expired_at    time.Time `json:"expired_at"`
	StartBalance  int       `json:"start_balance"`
	EstimatedTime time.Time `json:"estimate_time"`
	StatusID      int       `json:"status_id" gorm:"default:0"`
}

type Contests struct {
	gorm.Model
	ContestID    string `json:"contest_id"`
	CustomerID   uint   `json:"customer_id"`
	FxID         uint   `json:"fx_id"`
	FxMasterPw   string `json:"fx_master_pw"`
	FxInvesterPw string `json:"fx_invester_pw"`
	StatusID     int    `json:"status_id" gorm:"default:0"`
}

type ContestInfos struct {
	ContestID     string    `json:"contest_id"`
	Amount        float64   `json:"amount"`
	MaximumPerson int       `json:"maximum_person"`
	CurrentPerson int       `json:"current_person"`
	Start_at      time.Time `json:"start_at"`
	Expired_at    time.Time `json:"expired_at"`
	StartBalance  int       `json:"start_balance"`
	StatusID      int       `json:"status_id" gorm:"default:0"`
	CustomerID    uint      `json:"customer_id"`
	FxID          uint      `json:"fx_id"`
	FxMasterPw    string    `json:"fx_master_pw"`
	FxInvesterPw  string    `json:"fx_invester_pw"`
}

type LeaderBoards struct {
	gorm.Model
	ContestID      string  `json:"contest_id"`
	CustomerID     uint    `json:"customer_id"`
	StartBalance   int     `json:"start_balance"`
	CurrentBalance int     `json:"current_balance"`
	CurrentEquity  int     `json:"current_equity"`
	PnL            float64 `json:"pnl"`
}

type CpsMessages struct {
	gorm.Model
	TypeID  int    `json:"type_id"`
	Message string `json:"message"`
	IsSent  int    `json:"is_sent" gorm:"default:0"`
}
