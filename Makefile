#
#    Bem:
#
#		bem				Make bem bundle files
#		bem.clean		Clean bem bundle files
#
#    Build:
#
#		build			Create a build
#		build.remove	Remove a build
#
#    Lint:
#
# 		   lint       			Lint all files
# 		   lint.stylus			Lint stylus files
# 		   lint.js       		Lint javascript files
#

########################################################
###                     Variables                    ###
########################################################

# Tools directory
TOOLS_DIR := @ . node_modules/app-bem-dev/tools

# Bem tool
BEM_TOOL := $(TOOLS_DIR)/bem

# Build tool
BUILD_TOOL := $(TOOLS_DIR)/build

# Lint tool
LINT_TOOL := $(TOOLS_DIR)/lint

########################################################
###                     Bem rules                    ###
########################################################

# Make bem bundle files
.PHONY: bem
bem:
	$(BEM_TOOL) make

# Clean bem bundle files
.PHONY: bem.clean
bem.clean:
	$(BEM_TOOL) clean

########################################################
###                    Build rules                   ###
########################################################

# Create a build
.PHONY: build
build:
	$(BUILD_TOOL) create

# Remove a build
.PHONY: build.remove
build.remove:
	$(BUILD_TOOL) remove

########################################################
###                    Lint rules                    ###
########################################################

# Lint all files
.PHONY: lint
lint: lint.css lint.js

# Lint css files
.PHONY: lint.css
lint.css:
	$(LINT_TOOL) stylus bem/blocks

# Lint javascript files
.PHONY: lint.js
lint.js:
	$(LINT_TOOL) js

