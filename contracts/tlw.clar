;; title: tlw
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants

;;owner
(define-constant contract-owner tx-sender)

;;errors
(define-constant err-owner-only (err u100))
(define-constant err-already-locked (err u101))
(define-constant err-unlock-in-past (err u102))
(define-constant err-no-value (err u103))
(define-constant err-beneficiary-only (err u104))
(define-constant err-unlock-height-not-reached (err u105))

;;

;; data vars
;;define the beneficiary and unlock-height
(define-data-var beneficiary (optional principal) none)
(define-data-var unlock-height uint u0)

;;

;; data maps
;;

;; public functions
;;lock function
(define-public (lock (new-beneficiary principal) (unlock-at uint) (amount uint))
    (begin 
        ;;only contract-owner can call lock
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)

        ;;wallet cannot be locked twice
        (asserts! (is-none (var-get beneficiary)) err-already-locked)

        ;;unlock-at should be greater than current height
        (asserts! (> unlock-at stacks-block-height) err-unlock-in-past)

        ;;initial deposit should be greater than zero
        (asserts! (> amount u0) err-no-value)

        ;;make the transfer
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))

        ;;set the beneficiary
        (var-set beneficiary (some new-beneficiary))

        ;;set the height
        (var-set unlock-height unlock-at)

        (ok true)
    )
)
;;

;; read only functions
;;

;; private functions
;;

