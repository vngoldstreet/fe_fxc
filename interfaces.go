package main

import (
	"time"

	"gorm.io/gorm"
)

type ResetPassword struct {
	Email string `json:"email" binding:"required"`
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
		Balance    float64   `json:"balance"`
		LastChange int       `json:"last_change"`
	} `json:"wallet"`
	Transactions []struct {
		ID            int       `json:"ID"`
		CreatedAt     time.Time `json:"CreatedAt"`
		UpdatedAt     time.Time `json:"UpdatedAt"`
		DeletedAt     any       `json:"DeletedAt"`
		TypeID        int       `json:"type_id"`
		CustomerID    uint      `json:"customer_id"`
		CBalance      float64   `json:"c_balance"`
		Amount        float64   `json:"amount"`
		NBalance      float64   `json:"n_balance"`
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
		StartBalance  float64   `json:"start_balance"`
		EstimateTime  time.Time `json:"estimate_time"`
		StatusID      int       `json:"status_id"`
		Account       int       `json:"account"`
	} `json:"contest_list"`
}

type PromoCodeResponse struct {
	Data struct {
		ID         int       `json:"ID"`
		CreatedAt  time.Time `json:"CreatedAt"`
		UpdatedAt  time.Time `json:"UpdatedAt"`
		DeletedAt  any       `json:"DeletedAt"`
		CustomerID int       `json:"customer_id"`
		PromoCode  string    `json:"promo_code"`
		Discount   float64   `json:"discount"`
		Status     int       `json:"status"`
	} `json:"data"`
}

type InputRejoins struct {
	ContestID string `json:"contest_id" binding:"required"`
	PromoCode string `json:"promo_code"`
}

type ResponseLeaderBoards struct {
	Data []struct {
		ContestID    string    `json:"contest_id"`
		CustomerID   int       `json:"customer_id"`
		FxID         string    `json:"fx_id"`
		FxMasterPw   string    `json:"fx_master_pw"`
		FxInvesterPw string    `json:"fx_invester_pw"`
		StatusID     int       `json:"status_id"`
		Balance      float64   `json:"balance"`
		Equity       float64   `json:"equity"`
		Profit       float64   `json:"profit"`
		StartBalance float64   `json:"start_balance"`
		Rank         int       `json:"rank"`
		StartAt      time.Time `json:"start_at"`
		ExpiredAt    time.Time `json:"expired_at"`
	} `json:"data"`
}

type InputLeaderBoards struct {
	ContestID string `json:"contest_id" binding:"required"`
	SortType  string `json:"sort_type"`
}

type LeaderBoardByContestID struct {
	Rank int `json:"rank"`
	User struct {
		Login         string  `json:"login"`
		Name          string  `json:"name"`
		LastName      string  `json:"last_name"`
		MiddleName    string  `json:"middle_name"`
		ContestID     string  `json:"contest_id"`
		Email         string  `json:"email"`
		Balance       float64 `json:"balance"`
		Equity        float64 `json:"equity"`
		Profit        float64 `json:"profit"`
		FloatingPl    float64 `json:"floating_pl"`
		EstimatePrize float64 `json:"estimate_prize"`
		StartBalance  float64 `json:"start_balance"`
		ContestType   string  `json:"contest_type"`
	} `json:"user"`
	LeaderBoard []struct {
		Login         string  `json:"login"`
		Name          string  `json:"name"`
		LastName      string  `json:"last_name"`
		MiddleName    string  `json:"middle_name"`
		ContestID     string  `json:"contest_id"`
		Email         string  `json:"email"`
		Balance       float64 `json:"balance"`
		Equity        float64 `json:"equity"`
		Profit        float64 `json:"profit"`
		FloatingPl    float64 `json:"floating_pl"`
		EstimatePrize float64 `json:"estimate_prize"`
		StartBalance  float64 `json:"start_balance"`
		ContestType   string  `json:"contest_type"`
	} `json:"leader_board"`
}

type InputLogin struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type InputWithdrawal struct {
	Amount        int `json:"amount" binding:"required"`
	PaymentMethob int `json:"payment_methob" binding:"required"`
}

type InputDeposit struct {
	Amount int `json:"amount" binding:"required"`
}

type InputIndentify struct {
	ImageFront string `json:"image_front" binding:"required"`
	ImageBack  string `json:"image_back" binding:"required"`
}

type InputJoinContest struct {
	ContestID string `json:"contest_id" binding:"required"`
}

type InputCreatePaymentMehob struct {
	HolderName   string `json:"holder_name" binding:"required"`
	HolderNumber string `json:"holder_number" binding:"required"`
	BankName     string `json:"bank_name" binding:"required"`
	IsCard       int    `json:"is_card"`
}

type GetInvestorPassword struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type ResponseLogin struct {
	Token string `json:"token"`
	User  struct {
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
}

type ReponsePaymentMethob struct {
	Data []struct {
		ID           int       `json:"ID"`
		CreatedAt    time.Time `json:"CreatedAt"`
		UpdatedAt    time.Time `json:"UpdatedAt"`
		DeletedAt    any       `json:"DeletedAt"`
		CustomerID   int       `json:"customer_id"`
		HolderName   string    `json:"holder_name"`
		HolderNumber string    `json:"holder_number"`
		BankName     string    `json:"bank_name"`
		IsCard       int       `json:"is_card"`
	} `json:"data"`
}

type ResponseUser struct {
	Data struct {
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
	} `json:"data"`
}

type ResponseUserWallet struct {
	Data struct {
		ID         int       `json:"ID"`
		CreatedAt  time.Time `json:"CreatedAt"`
		UpdatedAt  time.Time `json:"UpdatedAt"`
		DeletedAt  any       `json:"DeletedAt"`
		CustomerID uint      `json:"customer_id"`
		Balance    float64   `json:"balance"`
		LastChange float64   `json:"last_change"`
	} `json:"data"`
}

type ResponseUserWithdrawal struct {
	NewWallet struct {
		ID         int       `json:"ID"`
		CreatedAt  time.Time `json:"CreatedAt"`
		UpdatedAt  time.Time `json:"UpdatedAt"`
		DeletedAt  any       `json:"DeletedAt"`
		CustomerID uint      `json:"customer_id"`
		Balance    float64   `json:"balance"`
		LastChange float64   `json:"last_change"`
	} `json:"new_wallet"`
	OldWallet struct {
		ID         int       `json:"ID"`
		CreatedAt  time.Time `json:"CreatedAt"`
		UpdatedAt  time.Time `json:"UpdatedAt"`
		DeletedAt  any       `json:"DeletedAt"`
		CustomerID uint      `json:"customer_id"`
		Balance    float64   `json:"balance"`
		LastChange float64   `json:"last_change"`
	} `json:"old_wallet"`
}

type ResponseUserDeposit struct {
	Data struct {
		ID            int       `json:"ID"`
		CreatedAt     time.Time `json:"CreatedAt"`
		UpdatedAt     time.Time `json:"UpdatedAt"`
		DeletedAt     any       `json:"DeletedAt"`
		TypeID        int       `json:"type_id"`
		CustomerID    uint      `json:"customer_id"`
		CBalance      float64   `json:"c_balance"`
		Amount        float64   `json:"amount"`
		NBalance      float64   `json:"n_balance"`
		PaymentMethob int       `json:"payment_methob"`
		PaymentGate   int       `json:"payment_gate"`
		StatusID      int       `json:"status_id"`
		ParentID      int       `json:"parent_id"`
		ContestID     string    `json:"contest_id"`
	} `json:"data"`
}

type ResponseUserJoinContest struct {
	Class   string `json:"class"`
	Contest struct {
		ID           int       `json:"ID"`
		CreatedAt    time.Time `json:"CreatedAt"`
		UpdatedAt    time.Time `json:"UpdatedAt"`
		DeletedAt    any       `json:"DeletedAt"`
		ContestID    string    `json:"contest_id"`
		CustomerID   int       `json:"customer_id"`
		FxID         string    `json:"fx_id"`
		FxMasterPw   string    `json:"fx_master_pw"`
		FxInvesterPw string    `json:"fx_invester_pw"`
		StatusID     int       `json:"status_id"`
	} `json:"contest"`
	ContestInfo struct {
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
		StartBalance  float64   `json:"start_balance"`
		EstimateTime  time.Time `json:"estimate_time"`
		StatusID      int       `json:"status_id"`
		Account       int       `json:"account"`
		TypeID        int       `json:"type_id"`
	} `json:"contest_info"`
	Message string `json:"message"`
}

// type ResponsePartner struct {
// 	Data []struct {
// 		ID          int       `json:"ID"`
// 		CreatedAt   time.Time `json:"CreatedAt"`
// 		UpdatedAt   time.Time `json:"UpdatedAt"`
// 		DeletedAt   any       `json:"DeletedAt"`
// 		Name        string    `json:"name"`
// 		Email       string    `json:"email"`
// 		Phone       string    `json:"phone"`
// 		Password    string    `json:"password"`
// 		PartnerCode string    `json:"partner_code"`
// 		Image       string    `json:"image"`
// 		Description string    `json:"description"`
// 		RefLink     string    `json:"ref_link"`
// 		InReview    string    `json:"in_review"`
// 		IsTest      int       `json:"is_test"`
// 	} `json:"data"`
// }

type ResponsePartnerCommissionLevel struct {
	ID          int       `json:"ID"`
	CreatedAt   time.Time `json:"CreatedAt"`
	UpdatedAt   time.Time `json:"UpdatedAt"`
	DeletedAt   any       `json:"DeletedAt"`
	TypeID      int       `json:"type_id"`
	PartnerID   int       `json:"partner_id"`
	Level1      int       `json:"level_1"`
	Level2      int       `json:"level_2"`
	Level3      int       `json:"level_3"`
	Level4      int       `json:"level_4"`
	Level5      int       `json:"level_5"`
	Commission1 int       `json:"commission_1"`
	Commission2 int       `json:"commission_2"`
	Commission3 int       `json:"commission_3"`
	Commission4 int       `json:"commission_4"`
	Commission5 int       `json:"commission_5"`
}

type ResponsePartner struct {
	Data struct {
		Owner struct {
			User struct {
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
			TotalJoined int `json:"total_joined"`
			Day         int `json:"day"`
			Week        int `json:"week"`
			Month       int `json:"month"`
			Commission  []struct {
				ID              int       `json:"ID"`
				CreatedAt       time.Time `json:"CreatedAt"`
				UpdatedAt       time.Time `json:"UpdatedAt"`
				DeletedAt       any       `json:"DeletedAt"`
				TransactionID   int       `json:"transaction_id"`
				TransactionType int       `json:"transaction_type"`
				ParentID        int       `json:"parent_id"`
				ContestID       string    `json:"contest_id"`
				Amount          int       `json:"amount"`
				TypeID          int       `json:"type_id"`
				Joined          int       `json:"joined"`
			} `json:"commission"`
		} `json:"owner"`
		Customers []struct {
			Customers struct {
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
			} `json:"customers"`
			TotalJoined int `json:"total_joined"`
			Day         int `json:"day"`
			Week        int `json:"week"`
			Month       int `json:"month"`
			Commission  []struct {
				ID              int       `json:"ID"`
				CreatedAt       time.Time `json:"CreatedAt"`
				UpdatedAt       time.Time `json:"UpdatedAt"`
				DeletedAt       any       `json:"DeletedAt"`
				TransactionID   int       `json:"transaction_id"`
				TransactionType int       `json:"transaction_type"`
				ParentID        int       `json:"parent_id"`
				ContestID       string    `json:"contest_id"`
				Amount          int       `json:"amount"`
				TypeID          int       `json:"type_id"`
				Joined          int       `json:"joined"`
			} `json:"commission"`
		} `json:"customers"`
	} `json:"data"`
}

type ResponseCheckDeposit struct {
	Count         int  `json:"count"`
	DepositAccept bool `json:"deposit_accept"`
}

type IndentifyInfo struct {
	Data struct {
		ID         int       `json:"ID"`
		CreatedAt  time.Time `json:"CreatedAt"`
		UpdatedAt  time.Time `json:"UpdatedAt"`
		DeletedAt  any       `json:"DeletedAt"`
		CustomerID int       `json:"customer_id"`
		ImageFront string    `json:"image_front"`
		ImageBack  string    `json:"image_back"`
		Status     string    `json:"status"`
	} `json:"data"`
}

type CommissionLevels struct {
	gorm.Model
	TypeID       int     `json:"type_id"` //=1 day, =2 week,-3 month
	PartnerID    uint    `json:"partner_id"`
	Level_1      int     `json:"level_1"`
	Level_2      int     `json:"level_2"`
	Level_3      int     `json:"level_3"`
	Level_4      int     `json:"level_4"`
	Level_5      int     `json:"level_5"`
	Commission_1 float64 `json:"commission_1"`
	Commission_2 float64 `json:"commission_2"`
	Commission_3 float64 `json:"commission_3"`
	Commission_4 float64 `json:"commission_4"`
	Commission_5 float64 `json:"commission_5"`
}

type InputCommissionUpdate struct {
	Data []struct {
		ParentID     int     `json:"parent_id" binding:"required"`
		PartnerID    int     `json:"partner_id" binding:"required"`
		Commission_1 float64 `json:"commission_1" binding:"required"`
		Commission_2 float64 `json:"commission_2" binding:"required"`
		Commission_3 float64 `json:"commission_3" binding:"required"`
		Commission_4 float64 `json:"commission_4" binding:"required"`
		Commission_5 float64 `json:"commission_5" binding:"required"`
		TypeID       float64 `json:"type_id" binding:"required"`
	} `json:"data"`
}
