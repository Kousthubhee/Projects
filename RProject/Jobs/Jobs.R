## Load the required libraries ####
library(tidyverse)
##Change Column names and load the dataset ####
names <- c("Index","JobTitle", "SalaryEstimate", "JobDescription", "Rating", "CompanyName", "Location",  
           "Headquarters", "Size", "Founded", "TypeOfOwnership", "Industry",  
           "Sector", "Revenue", "Competitors") 
jobs<- read_tsv("findme.txt", col_names = names, skip = 1)

##getting titles in columns and values in rows and removing the index column ####
jobs_long <- jobs %>% 
  pivot_longer(!Index, names_to = "Name", values_to = "value")%>%
  pivot_wider(names_from = Index, values_from = value)%>%
  select(-Name)

##Summary and Glimpse of the dataset ####
summary(jobs_long)
glimpse(jobs_long)

##Converting the columns to numeric ####
jobs_long$Rating <- as.numeric(jobs_long$Rating)
jobs_long$Founded <- as.numeric(jobs_long$Founded)

##Separating the Glassdoor and employee est from the Salary Estimate column ####
jobs_long <- jobs_long %>% 
  separate(`Salary Estimate`, c("SalaryRange", "ExtraInfo"), sep = "\\(")%>%
  separate(SalaryRange, ("SalaryRange"), sep = " ")%>% 
  separate(ExtraInfo, "ExtraInfo", sep = "\\)")
jobs_long <- separate(jobs_long, SalaryRange, c("MinSalary", "MaxSalary"),"-")



##Separating the Company Name and Rating from the Company Name column ####
unique(jobs_long$CompanyName)
jobs_long <-jobs_long %>% 
  separate(`Company Name`, c("CompanyName", "Rating"),
           sep = "(?<=[A-Za-z])\\s(?=[0-9.])")
jobs_long<- jobs_long %>%
  separate(CompanyName,"CompanyName",
           sep = "\n")

jobs_long <- jobs_long %>%
  mutate(`Job Description` = str_replace_all(str_replace_all(`Job Description`, "\n\n", " "), "\\*", ""))

unique(jobs_long$Rating) 

## Changing -1 values to NA in all columns and leaving unknown as unknown ####

#Changing -1 value to NA in location column 
unique(jobs_long$Location) 
jobs_long<- jobs_long %>%
  mutate(Location = ifelse(Location ==-1, NA,Location))

# Changing -1 value to NA in headquarters column 
unique(jobs_long$Headquarters)
jobs_long<- jobs_long %>%
  mutate(Headquarters = ifelse(Headquarters ==-1, NA,Headquarters))

# Changing -1 value to NA in Size column
unique(jobs_long$Size) 
jobs_long<- jobs_long %>%
  mutate(Size = ifelse(Size ==-1, NA,Size))

# Changing -1 value to NA in Founded column
unique(jobs_long$Founded) 
jobs_long <- jobs_long %>%
  mutate(Founded = ifelse(Founded == -1, NA, Founded))

# Changing -1 value to NA in Type of ownership column
jobs_long<- jobs_long %>%
  mutate(`Type of ownership` = ifelse(`Type of ownership` ==-1, NA,`Type of ownership`))

# Changing -1 value to NA in Industry column
unique(jobs_long$Industry)
jobs_long<- jobs_long %>%
  mutate(Industry = ifelse(Industry ==-1, NA,Industry))

# Changing -1 value to NA in Sector column
unique(jobs_long$Sector)
jobs_long<- jobs_long %>%
  mutate(Sector = ifelse(Sector ==-1, NA,Sector))

# Changing -1 value to NA in Revenue column
unique(jobs_long$Revenue) 
jobs_long<- jobs_long %>%
  mutate(Revenue = ifelse(Revenue ==-1, NA,Revenue))

# Changing -1 value to NA in Competitors column
unique(jobs_long$Competitors)
jobs_long<- jobs_long %>%
  mutate(Competitors = ifelse(Competitors ==-1, NA,Competitors))



##Checking the unique values in all the columns ####
unique(jobs_long$`Job Title`) 
unique(jobs_long$MaxSalary)
unique(jobs_long$MinSalary)
unique(jobs_long$`Job Description`) 
unique(jobs_long$CompanyName) 
unique(jobs_long$Rating)  
unique(jobs_long$Location) 
unique(jobs_long$Headquarters)
unique(jobs_long$Size) 
unique(jobs_long$Founded) 
unique(jobs_long$`Type of ownership`) 
unique(jobs_long$Industry)
unique(jobs_long$Sector)
unique(jobs_long$Revenue) 
unique(jobs_long$Competitors)

glimpse(jobs_long)


##Converting the Salary columns to Max and Min and removing K and $ ####
jobs_long <- jobs_long%>%
  mutate(MinSalary = str_replace(MinSalary, "K", "1000"))
jobs_long <- jobs_long%>%
  mutate(MaxSalary = str_replace(MaxSalary, "K", "1000"))

jp <- jobs_long

jobs_long <- jobs_long%>%
  separate(MinSalary, c("Waste", "MinSalary"), sep = "\\$")%>%
  separate(MaxSalary, c("Waste", "MaxSalary"), sep = "\\$")%>%
  select(-Waste)



# Converting the Salary columns to numeric ####
jobs_long$MaxSalary <- as.numeric(jobs_long$MaxSalary)

jobs_long$MinSalary <- as.numeric(jobs_long$MinSalary)

glimpse(jobs_long)

##Boxplot for all the columns ####
boxplot(jobs_long$Founded, main = "boxplot for Founded")
boxplot(jobs_long$Rating, main = "boxplot for Rating")
boxplot(jobs_long$MinSalary, main = "boxplot for MinSalary")
boxplot(jobs_long$MaxSalary, main = "boxplot for MaxSalary")



