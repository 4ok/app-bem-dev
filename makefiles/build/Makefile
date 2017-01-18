#
# Actions:
#
#    build      Build application
#

########################################################
###                     Variables                    ###
########################################################

# Space char
SPACE = $() $()

# Mongo gost
MONGO_HOST ?= 127.0.0.1

# Node modules directory
NODE_MODULES_DIR ?= node_modules

# Node modules binary directory
NODE_MODULES_BIN_DIR ?= $(NODE_MODULES_DIR)/.bin

IMAGEMIN ?= $(NODE_MODULES_BIN_DIR)/imagemin

# Bem dir
BEM_DIR ?= bem

# Configs dir
CONFIGS_DIR ?= configs

# Node config dir
CONFIG_NODE_DIR ?= $(CONFIGS_DIR)/node

# Project name
PROJECT_NAME ?= `basename $(PWD)`

# Bem links filename
BEM_LINKS_FILE ?= $(BEM_DIR)/links.json

# Bundle dir name
BUNDLE_DIR ?= bem/bundles/index

# Bundle file name
BUNDLE_FILE ?= index

# Public directory
PUBLIC_DIR ?= public

# Build directory
BUILD_DIR ?= build

# Files suffixes for compress
COMPRESS_SUFFIXES ?= css|js|eot|svg|ttf|woff|pdf|xml|txt

# Images suffixes for optimize
OPTIMIZE_IMAGES_SUFFIXES ?= jpg jpeg png gif svg

# Images suffixes for optimize comma separated
OPTIMIZE_IMAGES_SUFFIXES_SEP_COMMA ?= $(subst $(SPACE),$(shell echo ,),$(OPTIMIZE_IMAGES_SUFFIXES))

# Images suffixes for optimize vertical bar separated
OPTIMIZE_IMAGES_SUFFIXES_SEP_VERT_BAR ?= $(subst $(SPACE),|,$(OPTIMIZE_IMAGES_SUFFIXES))

# Images suffixes for optimize
OPTIMIZE_IMAGES ?= jpg jpeg png gif svg

########################################################
###                      Export                      ###
########################################################

# Gzip compress level
export GZIP ?= -9

# Enb make is minify files
export ENB_IS_MINIFY ?= 1

# Build environment
export BUILD_ENV ?= production

########################################################
###                     Functions                    ###
########################################################

#
# Print the title of action
#
# $(1) {String} Title
#
ifndef printActionTitle
define printActionTitle
    $(info )
    $(info =====> $(1))
endef
endif

########################################################
###                     Copy rules                   ###
########################################################

.PHONY: build
build: build.copy build.gzip-public build.dump

.PHONY: build.copy
build.copy: build.copy.bem build.copy.app \
            build.copy.makefile build.copy.install-files \
            build.copy.public-optimize-images build.copy.public-files

.PHONY: build.copy.bem
build.copy.bem:
	$(call printActionTitle,Coping bem files)

	rm -rf $(BUILD_DIR)
	mkdir $(BUILD_DIR)

	mkdir -p $(BUILD_DIR)/$(BUNDLE_DIR)
	cp $(BUNDLE_DIR)/$(BUNDLE_FILE).bemtree.min.js $(BUILD_DIR)/$(BUNDLE_DIR)
	cp $(BUNDLE_DIR)/$(BUNDLE_FILE).bemhtml.min.js $(BUILD_DIR)/$(BUNDLE_DIR)

	cp $(BEM_LINKS_FILE) $(BUILD_DIR)/$(BEM_LINKS_FILE)

.PHONY: build.copy.app
build.copy.app:
	$(call printActionTitle,Coping application files)

	cp index.js $(BUILD_DIR)

	cp -r routes $(BUILD_DIR)
	cp -r src $(BUILD_DIR)

	mkdir -p $(BUILD_DIR)/$(CONFIG_NODE_DIR)
	cp $(CONFIG_NODE_DIR)/default*.js $(BUILD_DIR)/$(CONFIG_NODE_DIR)
	cp $(CONFIG_NODE_DIR)/$(BUILD_ENV)*.js $(BUILD_DIR)/$(CONFIG_NODE_DIR)

.PHONY: build.copy.makefile
build.copy.makefile:
	$(call printActionTitle,Coping makefile)

	mkdir $(BUILD_DIR)/makefiles
	find makefiles -type f -d 1 -exec cp {} $(BUILD_DIR)/makefiles \;
	cp makefiles/env/$(BUILD_ENV) $(BUILD_DIR)/Makefile

.PHONY: build.copy.install-files
build.copy.install-files:
	$(call printActionTitle,Coping install files')

	cp bower.json $(BUILD_DIR)
	cp .bowerrc $(BUILD_DIR)
	cp package.json $(BUILD_DIR)

.PHONY: build.copy.public-files
build.copy.public-files:
	$(call printActionTitle,Coping not images files)

	find $(PUBLIC_DIR) -type f ! -name '.*' \
	    | grep -Ev '/.+\.($(OPTIMIZE_IMAGES_SUFFIXES_SEP_VERT_BAR))$$' \
	    | xargs -I {} rsync -R {} $(BUILD_DIR)/

########################################################
###                   Minify rules                   ###
########################################################

.PHONY: build.copy.public-optimize-images
build.copy.public-optimize-images:
	$(call printActionTitle,Optimizing and coping public images)

	find $(PUBLIC_DIR) -type d \
	    -exec $(IMAGEMIN) {}/*.{$(OPTIMIZE_IMAGES_SUFFIXES_SEP_COMMA)} \
	    --plugin mozjpeg \
	    --plugin pngquant \
	    --plugin gifsicle \
	    --plugin svgo \
	    -o $(BUILD_DIR)/{} \;

.PHONY: build.gzip-public
build.gzip-public:
	$(call printActionTitle,Gziping public files)

	find $(BUILD_DIR)/public \
	    | grep -E '\.($(COMPRESS_SUFFIXES))' \
	    | xargs gzip -kv9

########################################################
###                    Dump rules                    ###
########################################################

.PHONY: build.dump
build.dump:
	$(call printActionTitle,Dumping database)

	mongodump -h $(MONGO_HOST) -d $(PROJECT_NAME) -o $(BUILD_DIR)/dump
