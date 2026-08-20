;; title: sc
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
;;

;; data vars
;;

;; data maps
;;

;; public functions
;;claim function
(define-public (claim) 
  (begin 
    (try! (as-contract (contract-call? .tlw claim)))
    (let 
      (
        (total-balance (as-contract (stx-get-balance tx-sender)))
      )
      (let 
        (
          (share (/ total-balance u4))
        )
        (try! (as-contract (stx-transfer? share tx-sender 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)))
        (try! (as-contract (stx-transfer? share tx-sender 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)))
        (try! (as-contract (stx-transfer? share tx-sender 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)))
        (try! (as-contract (stx-transfer? (stx-get-balance tx-sender) tx-sender 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC)))
        (ok true)
      )
    )
  )
)

;;

;; read only functions
;;

;; private functions
;;

