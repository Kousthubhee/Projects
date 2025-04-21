# Kousthubhee Krishna Kotte #####
# Shravan Kumar vamsi Dadi #####
# Srivatsava Chinnasamy Kamaraj #####
library(ca)
library(FactoMineR)
library(factoextra)
library(cluster)
library(dendextend)


#reading the data
cuisine_data <- read.table("Cusine-pref-raw.txt", header=T, row.names=1, sep="\t")
View(cuisine_data)


# Step 1: Count the Number of Countries and Cuisines in the Dataset

cat("Countries:", ncol(cuisine_data), "\nCuisines:", nrow(cuisine_data), "\n")

# Step 2: Summarize the Dataset to Understand Cuisine Preferences Across Countries
summary(cuisine_data)

#Great Britain has the highest overall mean and median values, indicating it consistently shows strong preference for most cuisines.
#Germany records the highest single-cuisine preference value, highlighting exceptionally strong interest in specific cuisines.
#Singapore demonstrates consistently high median and narrow variability, suggesting steady, strong preferences across many cuisines.
#Japan shows low mean and narrow range, reflecting generally conservative or selective preferences.
#Norway has the lowest minimum and low average, indicating it is among the least engaged countries in cuisine preferences.
#Australia displays high variability, with some cuisines highly liked and others not at all — suggesting diverse or divided taste.

# Step 3: Compute Summary Statistics for Each Cuisine (Min, Max, Mean, Median, SD)
row_summary <- data.frame(
  Min = apply(cuisine_data, 1, min),
  Max = apply(cuisine_data, 1, max),
  Mean = round(apply(cuisine_data, 1, mean), 2),
  Median = apply(cuisine_data, 1, median),
  SD = round(apply(cuisine_data, 1, sd), 2)
)
row_summary

#Italian cuisine has the highest overall mean and median values, indicating that it is the most consistently and widely preferred cuisine across countries.
#Greek cuisine shows the highest standard deviation, reflecting highly variable preferences — strongly favored in some countries and much less in others, making it the most polarizing cuisine.
#German cuisine reaches the highest single-country preference value, suggesting extreme popularity in at least one country, but with inconsistency elsewhere.
#Finnish cuisine has both the lowest mean and standard deviation, indicating it is the least preferred and also uniformly underrepresented across countries.
#British cuisine demonstrates high variation with a moderate mean, highlighting regional strength — popular in some places but weak in others.
#Mexican and USA cuisines both have high mean values and low standard deviations, suggesting stable and consistently strong preferences globally.
#Peruvian cuisine shows low average preference and very low variability, indicating it is consistently less selected across all countries.

# Step 4: Convert Data to Table Format for Correspondence Analysis
food_data <- as.table(as.matrix(cuisine_data))

# Step 5: Perform Chi-Squared Test of Independence Between Cuisines and Countries
results <- chisq.test(food_data)
results

#A very large value suggests a strong deviation from independence.

# p-value < 2.2e-16
# This is extremely small (much smaller than 0.05).
# Reject the null hypothesis: There is a significant association between cuisines and countries.
# So: People's preferences for cuisines vary significantly across countries.
# The result strongly justifies using Simple Correspondence Analysis (SCA),
# because it confirms there is structure in the data — not just random noise.


# Step 6: Extract and Sort Standardized Residuals to Identify Strongest Cuisine–Country Associations
                                         
results$stdres # for getting the standardized residuals
stdres_df <- as.data.frame(as.table(results$stdres))
colnames(stdres_df) <- c("Cuisine", "Country", "StdResidual")
stdres_df_sorted <- stdres_df[order(-abs(stdres_df$StdResidual)), ]
head(stdres_df_sorted, 50)

#########################################################################################
#                            SUMMARY OF KEY INSIGHTS FROM STD. RESIDUALS               #
#########################################################################################

# 1. Strong National Loyalty to Native Cuisines
# Countries showed extremely high positive standardized residuals for their own cuisines.
# Examples:
# - Saudi Arabian in Saudi Arabia (+33.5)
# - Danish in Denmark (+27.2)
# - Filipino in Philippines (+26.9)
# - Indonesian in Indonesia, German in Germany, Malaysian in Malaysia, etc.
# --> Confirms strong cultural attachment to national foods.

# 2. Regional and Cultural Affinities
# High preference observed not just for native, but also for neighboring or culturally close cuisines:
# - Lebanese in Saudi Arabia (+22.5)
# - Emirati in UAE & Saudi Arabia
# - Spanish and Argentinian in Spain & Italy
# --> Suggests shared history, ingredients, or culinary styles.

# 3. Underappreciated or Culturally Distant Cuisines
# Significant negative residuals indicate much lower-than-expected preferences:
# - Moroccan in Australia (−22.2)
# - British in Germany (−15.7)
# - Indian in China (−12.8)
# - Indonesian in Malaysia (−12.7), Korean in Japan, etc.
# --> Indicates that geographical proximity doesn't always translate into culinary preference.

# 4. Cross-Cultural Exceptions
# A few non-native cuisines are surprisingly well-liked:
# - Lebanese in UAE
# - Turkish in Saudi Arabia
# - Argentinian in Spain/Italy
# --> Reflect possible cultural exchange or migration influence.


# Overall Insight:
# - People prefer their own and neighboring cuisines the most.
# - There are interesting exceptions and mismatches.
# - SCA is appropriate to visually explore these associations further.



# Step 7: Compute Phi-Squared and Cramér’s V to Measure Association Strength

Phi2 <- results$statistic / sum(food_data) # Phi-squared
Phi2  # Phi coefficient
I <- nrow(food_data)  # Number of cuisines
J <- ncol(food_data)  # Number of countries
max_Phi <- min(I, J) - 1
V <- sqrt(Phi2 / max_Phi)  # Cramér’s V
V

# Cramér’s V = 0.05456
# Interpretation:
# - Statistically significant association exists (confirmed by chi-squared test)
# - However, the strength of association is weak (V < 0.10)
# - This suggests a diffuse pattern: no single country dominates overall preference
# - Still meaningful for exploration with Correspondence Analysis (SCA)


# Step 8: Create Pair Profile Matrix with Proportional Frequencies (nij / n)

F <- as.matrix(prop.table(food_data))  # nij / n
round(addmargins(F), 5)  # Adds row/column/total margins for inspection


# Step 9: Visualize the Top 5 Cuisines by Their Overall Preference Share (Row Totals)

# Total share of each cuisine
cuisine_totals <- rowSums(F)
top_cuisines <- sort(cuisine_totals, decreasing = TRUE)[1:5]

# Barplot and capture bar positions
bp1 <- barplot(top_cuisines,
               main = "Top 5 Cuisines by Total Preference Share",
               col = "tomato",
               las = 2,
               ylab = "Proportion of Total Votes",
               ylim = c(0, max(top_cuisines) + 0.01))  # Add space for labels

# Add percentage labels
text(x = bp1,
     y = top_cuisines + 0.002,
     labels = paste0(round(100 * top_cuisines, 2), "%"),
     cex = 0.9)

#########################################################################################
#                        Inference: Top 5 Cuisines by Total Preference Share            #
#########################################################################################

# These values are based on the row sums of the pair profile matrix (F),
# showing the overall share of preferences received by each cuisine globally.

# 1 Italian cuisine is the most popular overall, with 4.67% of all preferences.
# 2 Chinese cuisine follows with 4.37%, showing strong global appeal.
# 3 Mexican (4.18%), Thai (3.86%), and French (3.84%) cuisines complete the top five.

# Interpretation:
# - The leading cuisines are internationally popular and often found across global food cultures.
# - Their high shares indicate broad acceptance across multiple countries in the dataset.
# - These cuisines likely have widespread influence in the SCA plot and will appear closer to the center or attract clusters of countries.

#  SCA Implication:
# - These top cuisines may pull more countries toward them in the correspondence map.
# - Their wide appeal suggests that they act as "anchors" in the multidimensional space, helping to define key axes of variation.

#########################################################################################


# Step 10: Visualize the Top 5 Countries by Their Overall Preference Share (Column Totals)

# Total share of each country
country_totals <- colSums(F)
top_countries <- sort(country_totals, decreasing = TRUE)[1:5]

# Barplot and capture bar positions
bp2 <- barplot(top_countries,
               main = "Top 5 Countries by Total Preference Share",
               col = "steelblue",
               las = 2,
               ylab = "Proportion of Total Votes",
               ylim = c(0, max(top_countries) + 0.01))  # Add space for labels

# Add percentage labels
text(x = bp2,
     y = top_countries + 0.002,
     labels = paste0(round(100 * top_countries, 2), "%"),
     cex = 0.9)

#########################################################################################
#                        Inference: Top 5 Countries by Total Preference Share           #
#########################################################################################

# These results are based on the column sums of the pair profile matrix (F),
# representing the share of total votes contributed by each country.

# 1️ Germany contributes the most, with 7.35% of total cuisine preferences.
# 2 Great Britain follows closely, contributing 7.15%.
# 3️ Singapore (4.83%), Australia (4.66%), and the Philippines (4.65%) complete the top five.

#  Interpretation:
# - Germany and Great Britain are the two most dominant countries in the dataset,
#   together accounting for over 14% of all responses.
# - The remaining top countries (Singapore, Australia, Philippines) show that
#   the dataset includes diverse representation across Europe, Asia, and Oceania.

#  SCA Implication:
# - These countries will likely have stronger “masses” (weights) in the correspondence analysis,
#   meaning their coordinates and relationships may shape the geometry of the SCA plot more noticeably.
# - Countries with lower total shares will have less influence and may appear more variable.

#########################################################################################

# Step 11: Plot Top 10 Cuisine–Country Pairs Based on Highest Proportion of Preference

# Flatten and sort the matrix
pair_profile <- as.data.frame(as.table(F))
colnames(pair_profile) <- c("Cuisine", "Country", "Proportion")

# Get top 10 contributing pairs
top_pairs <- pair_profile[order(-pair_profile$Proportion), ][1:10, ]
top_pairs



# Reorder by descending proportion
top_pairs <- top_pairs[order(-top_pairs$Proportion), ]
top_pairs$Label <- paste(top_pairs$Cuisine, "-", top_pairs$Country)

# Adjust plot margins: bottom increased to fit angled labels
par(mar = c(8, 4, 4, 2))  # bottom, left, top, right

# Plot with no names for now (we’ll add them manually)
bar_positions <- barplot(top_pairs$Proportion,
                         names.arg = FALSE,
                         col = "darkgreen",
                         ylim = c(0, max(top_pairs$Proportion) + 0.0015),
                         main = "Top 10 Cuisine–Country Pairs by Preference Share",
                         ylab = "Proportion of Total Votes")

# Add angled x-axis labels (45 degrees)
text(x = bar_positions,
     y = par("usr")[3] - 0.0003,  # y-position just below x-axis
     labels = top_pairs$Label,
     srt = 45,  # rotation
     adj = 1,
     xpd = TRUE,
     cex = 0.8)

# Add percentage labels on top of bars
text(x = bar_positions,
     y = top_pairs$Proportion + 0.0003,
     labels = paste0(round(top_pairs$Proportion * 100, 2), "%"),
     cex = 0.8)

#########################################################################################
#                  Inference: Top 10 Cuisine–Country Pairs by Preference Share          #
#########################################################################################

# These values are based on the pair profile matrix (F), showing which specific
# cuisine–country combinations contribute the most to the overall dataset.

# Top Contributors:
# 1 Italian - Germany (0.39%)
# 2️ German - Germany (0.38%)
# 3️ Greek - Germany (0.34%)
# 4️ British - Great Britain (0.34%)
# 5️ Italian - Great Britain (0.34%)
# 6️ Chinese - Germany (0.34%)
# 7️ Chinese - Great Britain (0.32%)
# 8 Indian - Great Britain (0.32%)
# 9️ Mexican - Germany (0.31%)
# 10 Spanish - Germany (0.30%)

#  Interpretation:
# - Germany dominates the top list with 6 out of 10 entries, showing that it contributes
#   significantly across a variety of cuisines (not just its own).
# - Great Britain appears in 4 of the top 10, often with international cuisines like Italian,
#   Indian, and Chinese — suggesting a diverse food culture.
# - Italian cuisine appears twice — in Germany and Great Britain — indicating strong global appeal.

#  SCA Implication:
# - These high-weighted pairs (nij/N) will heavily influence the geometry of the correspondence analysis map.
# - Countries like Germany and Great Britain will act as central anchors due to their large mass and diverse cuisine preferences.
# - Cuisines like Italian, Chinese, and Greek are likely to be positioned closer to these countries.



# Step 12: Analyze Row Profile – Identify Countries That Prefer Indian Cuisine the Most

Row.F <- prop.table(food_data, margin = 1)  # Row-wise
round(addmargins(Row.F), 5)

# View the row profile for Indian cuisine (sorted highest to lowest)
sort(Row.F["Indian ", ], decreasing = TRUE)

#########################################################################################
#           Summary: Row Profile – Countries that Prefer Indian Cuisine Most            #
#########################################################################################

# Basic Observations:
# - Top countries that prefer Indian cuisine (share of Indian cuisine votes):
#   1. Great Britain (9.05%)
#   2. Germany (7.77%)
#   3. India (6.62%)
#   4. Singapore (4.76%)
#   5. Saudi Arabia (4.69%)
#   6. Australia, UAE, France, Malaysia: ~4–4.6%

#  Interpretation:
# - Indian cuisine enjoys strong international support, especially in **Western Europe**
#   (UK, Germany) and **multicultural hubs** like Singapore and UAE.
# - Surprisingly, **India ranks third**, suggesting that Indian food is more **globally spread**
#   than locally concentrated in this dataset.

#  Business Implication:
# - Indian restaurants, packaged foods, and spice brands should prioritize markets like the UK,
#   Germany, and Singapore, where demand is already high.
# - There's potential to expand offerings (e.g., ready meals, sauces, snacks) in Australia, UAE, and France.
# - In India itself, there may be space for **modernized or fusion offerings** that appeal to younger or globalized consumers.

#########################################################################################

# Step 13: Analyze Column Profile – Identify Top Cuisines Preferred in France

Col.F <- prop.table(food_data, margin = 2)  # Column-wise
round(addmargins(Col.F), 5)


# Preferences in France
sort(Col.F[, "France"], decreasing = TRUE)

#########################################################################################
#         Summary: Column Profile – Cuisines Preferred in France (Top Rankings)         #
#########################################################################################

# Basic Observations:
# - The most preferred cuisines in France are:
#   1. French (5.15%)
#   2. Italian (4.99%)
#   3. Spanish (4.67%)
#   4. Moroccan (4.34%)
#   5. Chinese (4.29%)
#   6. Mexican (4.19%)
#   7. Vietnamese, Indian, and Thai also show notable shares (3.8–4%)

#  Interpretation:
# - While French cuisine dominates (as expected), **Mediterranean** (Italian, Spanish, Greek),
#   Asian (Chinese, Indian, Thai, Vietnamese), and **North African** (Moroccan) cuisines
#   have strong presence in French preferences.
# - There is clear **multicultural openness** in the French palate.

#  Business Implication:
# - France is a prime market for **Mediterranean and Asian food products**, especially:
#   - Ready-to-eat meals
#   - Ethnic restaurants
#   - Grocery imports (spices, sauces, snacks)
# - Brands can capitalize on this diversity by launching **fusion products** or
#   running **targeted campaigns** in urban French areas with multicultural populations.
# - Exporters from India, Vietnam, Morocco, and China can consider **France as a
#   high-potential entry point** into Western Europe.

#########################################################################################


# Step 14: Identify Cuisines with Broad International Reach (Presence > 5% in Multiple Countries)
apply(Row.F, 1, function(x) sum(x > 0.05))  # Row spread

# Step 15: Identify Countries with the Most Concentrated Preference for a Single Cuisine
apply(Col.F, 2, function(x) max(x))  # Highest single-cuisine preference per country

# Step 16: Perform Simple Correspondence Analysis (SCA) Using the ca Package

results <- ca(food_data)

# Step 17: Summarize the SCA Results – Eigenvalues, Inertia, and Contributions

summary(results)


# Step 18: Visualize Symmetric Map Using fviz_ca_biplot – Cuisines and Countries Together

results <- ca(food_data, graph = FALSE)


fviz_ca_biplot(results,
               repel = TRUE,         
               col.row = "blue",    
               col.col = "red",      
               geom = c("point", "text"),  
               shape.row = 16,       
               shape.col = 17,       
               title = "SCA – Clean Symmetric Map (fviz_ca_biplot)")

# Interpretation: SCA – Clean Symmetric Map (fviz_ca_biplot)
# - Dim1 (29.4%) and Dim2 (25%) explain the most variation in preferences

# 1. Strong National Cuisine Affinities:
# - Saudi Arabia lies very close to Saudi Arabian cuisine → strong national loyalty
# - UAE is near Emirati, Indian, and Indonesian cuisines → reflecting multicultural influence
# - India is near Indian cuisine; Malaysia near Malaysian; Singapore near Singaporean → national alignment

# 2. East & Southeast Asian Cuisine Cluster:
# - Vietnamese, Thai, Korean, Taiwanese, and Hong Kong cuisines are grouped bottom-right
# - Aligned countries: Thailand, Vietnam, Taiwan, Hong Kong → strong regional culinary ties

# 3. European Culinary Core:
# - France, Germany, Italy, Spain, Sweden, and Denmark cluster near French, Italian, Spanish, and Greek cuisines
# - Indicates Western countries' preference for European and Mediterranean cuisines

# 4. Global Appeal of Some Cuisines:
# - Italian, Mexican, Chinese, French, German, and Indian cuisines are near the center
# - These have broad international appeal and are not tied to one specific country

# 5. Outliers and Unique Preferences:
# - Saudi Arabia (top of plot) stands out → highly unique preference pattern
# - Greek and Japanese cuisines are more isolated → niche or culturally concentrated appeal

# Regional Summary:
# - Middle East: Saudi Arabia ↔ Saudi Arabian, UAE ↔ Emirati, Lebanese
# - South/Southeast Asia: India, Indonesia, Malaysia ↔ Indian, Indonesian, Malaysian
# - East Asia: Hong Kong, Vietnam, Taiwan ↔ Vietnamese, Thai, Korean, Taiwanese
# - Western Europe: France, Italy, Spain, Germany ↔ European cuisines (French, Italian, etc.)
# - Multicultural: Singapore, Australia ↔ mix of Asian and global cuisines

# Inference:
# - Geography and culture strongly influence cuisine preferences
# - Some cuisines (Italian, Chinese, Indian) serve as global attractors
# - This map supports strategic planning for international food marketing and expansion



# Step 19: Filter and Plot Only Well-Represented Points (Cos² ≥ 0.5) in the CA Biplot

# Extract cos² values
row_cos2 <- get_ca_row(results)$cos2
col_cos2 <- get_ca_col(results)$cos2

# Calculate total cos² (Dim1 + Dim2)
row_cos2_total <- row_cos2[,1] + row_cos2[,2]
col_cos2_total <- col_cos2[,1] + col_cos2[,2]

# Set a threshold (e.g., 0.5 or 0.6 = well represented)
row_filter <- row_cos2_total >= 0.5
col_filter <- col_cos2_total >= 0.5

# Get names of points that are well represented
selected_rows <- names(row_filter[row_filter])
selected_cols <- names(col_filter[col_filter])

# Plot with filtering
fviz_ca_biplot(results,
               select.row = list(name = selected_rows),
               select.col = list(name = selected_cols),
               repel = TRUE,
               col.row = "blue",
               col.col = "red",
               shape.row = 16,
               shape.col = 17,
               title = "SCA – Well-Represented Points Only (Cos² ≥ 0.5)")

#########################################################################################
#                  Inference: Well-Represented Points in SCA (Cos² ≥ 0.5)               #
#########################################################################################

# General Observations:
# - Only the countries and cuisines with good representation on the first two dimensions are shown.
# - Cos² ≥ 0.5 indicates strong alignment with the CA axes — these points contribute meaningfully to interpretation.
# - The map is more readable and focused on the most important relationships.

# Notable Associations:
# - Saudi Arabian cuisine is tightly associated with Saudi Arabia, confirming strong national loyalty.
# - Emirati cuisine lies near UAE and Saudi Arabia, suggesting strong regional preferences.
# - Indian cuisine is relatively close to India, UAE, and Indonesia, confirming popularity in South/Southeast Asia.
# - Malaysian and Indonesian cuisines are strongly linked with Singapore and Malaysia — indicating shared cultural taste.
# - Korean, Vietnamese, and Thai cuisines align well with Taiwan, Hong Kong, and other East Asian countries.
# - European countries (France, Germany, Italy, Sweden) show affinity toward European cuisines (Italian, Spanish, Greek).
# - Moroccan and Lebanese cuisines appear further from Western Europe, indicating more localized or regional appeal.

# Business Implication:
# - Focus on high-affinity matches: e.g., Saudi Arabian cuisine thrives in Saudi Arabia, Malaysian cuisine in Malaysia/Singapore.
# - Cross-market potential: Indian and Turkish cuisines show spread across multiple culturally connected countries.
# - France, Germany, and Italy prefer traditional European cuisines — great for Mediterranean food exports.
# - Southeast Asia presents strong intra-regional demand (Malaysia ↔ Singapore ↔ Indonesia) — useful for cross-border F&B business.
# - Strategic expansion: Brands can prioritize regions where cuisine is both well-represented and aligned (based on proximity on map).
# - Global cuisines like Indian, Malaysian, Turkish show potential for fusion or franchising in multicultural hubs.





# Step 20: Perform Hierarchical Clustering on the CA Coordinates of Countries
results=CA(food_data)
# Using the coordinates of countries from the CA result.


# Step 21: These summarize each country's cuisine preference pattern in the reduced dimension space.
country.coord <- results$col$coord

# Step 22: Calculating distance between countries using their CA coordinates.
# This gives a matrix of dissimilarities to feed into hierarchical clustering.
d <- dist(country.coord)

# Step 23: Running hierarchical clustering using complete linkage method.
# Method builds clusters by joining the farthest pairs, helping ensure tight, distinct clusters.
hc <- hclust(d, method = "complete")

#step 24: Plotting the dendrogram to visualize the hierarchy of country clusters.
plot(as.dendrogram(hc), main="Dendrogram - Country Clustering (Complete Linkage)", cex=0.7)

# The dendrogram reveals clear regional groupings in cuisine preferences. 
#Saudi Arabia is highly distinct, forming its own branch. 
#Asian countries like Indonesia, Malaysia, India, and Thailand cluster together, reflecting shared regional tastes. 
#Western nations such as the USA, UK, and Germany form another cluster, indicating more globalized or balanced preferences. 
#This structure highlights strong cultural influence on cuisine choices across countries.

# step 25: Highlighting the clusters in the dendrogram.
rect.hclust(hc, k=4, border="violet")

# Step 26: Evaluating how many clusters to keep using Elbow and Silhouette methods.
# These help objectively decide the ideal number of clusters.
fviz_nbclust(country.coord, FUN = hcut, method = "wss")
fviz_nbclust(country.coord, FUN = hcut, method = "silhouette")

#  The Elbow method suggests 4 clusters — where the slope changes ("elbow") and gain slows down.
#  Silhouette method hints that 7 may be slightly better — but 4 remains a good balance between compactness and interpretability.

# Step 27: cutting the dendrogram into 4 clusters.
country.clusters <- cutree(hc, k=4)
table(country.clusters)

# Step 28: visualizing the final clusters on a CA-based map.
# This gives a clearer idea of how clusters relate to dimensions and which countries belong to each cluster.
fviz_cluster(list(data = country.coord, cluster = country.clusters),
             main="Cluster Visualization of Countries Based on Cuisine Preferences",
             repel=TRUE)


#The map shows 4 clusters of countries based on their cuisine preferences.

#Cluster 1 (Red): Includes India, UAE, Australia, Philippines — countries with a strong preference for local and regional Asian cuisines.

#Cluster 2 (Green): Groups Japan, Thailand, Vietnam, Hong Kong, Taiwan — reflecting strong East/Southeast Asian taste alignment.

#Cluster 3 (Blue): Includes USA, France, UK, Germany, Spain, Italy, Denmark, Norway, Sweden — Western countries with balanced or international preferences.

#Cluster 4 (Purple): Contains only Saudi Arabia, which stands apart, indicating a highly unique cuisine profile not shared with other countries.

#This visualization confirms that geographic and cultural proximity strongly influence national cuisine preferences.

#Conclusion:
# 1. National and Regional Loyalty is Strong
# Countries show strong preference for their own cuisines (e.g., Saudi Arabia, Denmark, Philippines, Germany, Indonesia).
# Neighboring or culturally linked cuisines are also well-received (e.g., UAE ↔ Emirati, Spain ↔ Argentinian, Singapore ↔ Malaysian).
# 
# Action Point:   Brands should emphasize authenticity and heritage when promoting national cuisines locally and regionally.
# 
# 2. Global Appeal of Select Cuisines
# Cuisines like Italian, Chinese, Indian, Mexican are popular across diverse geographies.
# Key Countries (high preference for global cuisines): Germany, Great Britain, Singapore, France, USA, Australia, Philippines, UAE.
# 
# Action Point:  These cuisines are ideal for international expansion, franchising, and fusion innovation — offering high returns in multicultural markets.
# 
# 3. Diverse Preferences Require Segmented Strategy
# Western Countries (France, Germany, UK, USA, Spain, Italy, Sweden, Denmark) have a broad culinary palate.
# Asia-Pacific countries (Japan, Thailand, Vietnam, Hong Kong, Taiwan) show tight regional preferences.
# Saudi Arabia stands apart with highly unique taste patterns.
# 
# Action Point:  Design regional menu variations, cluster-specific products, and country-specific marketing to reflect cultural diversity and culinary expectations.
# 
# 4. Expansion Opportunities in High-Potential Markets
# High-engagement markets like Germany and Great Britain show strong activity in multiple cuisines.
# Multicultural countries like Singapore and France show openness to diverse tastes and fusion products.
# High-potential expansion markets:   Germany, Great Britain, Singapore, France, USA, Australia, UAE, Philippines
# 
# Action Point:  Target cosmopolitan and multicultural countries for launching ethnic restaurants, specialty food products, or food tech innovations.
# 

