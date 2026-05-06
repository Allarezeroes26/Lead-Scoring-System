from pydantic import BaseModel, Field
from enum import Enum

class Job(str, Enum):
    ADMIN = "admin"
    TECHNICIAN = "technician"
    SERVICES = "services"
    MANAGEMENT = "management"
    RETIRED = "retired"
    BLUE_COLLAR = "blue-collar"
    UNEMPLOYED = "unemployed"
    ENTREPRENEUR = "entrepreneur"
    HOUSEMAID = "housemaid"
    STUDENT = "student"
    SELF_EMPLOYED = "self-employed"
    UNKNOWN = "unknown"

class MaritalStatus(str, Enum):
    SINGLE = "single"
    MARRIED = "married"
    DIVORCED = "divorced"

class EducationLevel(str, Enum):
    PRIMARY = "primary"
    SECONDARY = "secondary"
    TERTIARY = "tertiary"
    UNKNOWN = "unknown"

class ContactMethod(str, Enum):
    CELLULAR = "cellular"
    TELEPHONE = "telephone"
    UNKNOWN = "unknown"

class Month(str, Enum):
    JAN = "jan"
    FEB = "feb"
    MAR = "mar"
    APR = "apr"
    MAY = "may"
    JUN = "jun"
    JUL = "jul"
    AUG = "aug"
    SEP = "sep"
    OCT = "oct"
    NOV = "nov"
    DEC = "dec"

class POutcome(str, Enum):
    FAILURE = "failure"
    SUCCESS = "success"
    OTHER = "other"
    UNKNOWN = "unknown"


class Customer(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Customer age")
    job: Job
    marital: MaritalStatus
    education: EducationLevel
    default: bool = Field(..., description="Has credit default?")
    balance: float = Field(..., description="Account balance")
    housing: bool = Field(..., description="Has housing loan?")
    loan: bool = Field(..., description="Has personal loan?")
    contact: ContactMethod

    day: int = Field(..., ge=1, le=31, description="Last contact day")
    month: Month
    duration: int = Field(..., ge=0, description="Call duration (seconds)")
    campaign: int = Field(..., ge=1, description="Contacts during campaign")

    # Defaults
    pdays: int = Field(-1, description="-1 means never contacted before")
    previous: int = Field(0, ge=0, description="Number of previous contacts")
    poutcome: POutcome = Field(POutcome.UNKNOWN)