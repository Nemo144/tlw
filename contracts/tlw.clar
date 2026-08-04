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
;;

;; read only functions
;;

;; private functions
;;

