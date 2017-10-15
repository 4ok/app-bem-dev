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

########################################################
###                     Variables                    ###
########################################################

# Development tools
DEV_TOOLS := @ . node_modules/app-bem-dev/tools

# Bem tool
BEM_TOOL := $(DEV_TOOLS)/bem

# Build tool
BUILD_TOOL := $(DEV_TOOLS)/build

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
